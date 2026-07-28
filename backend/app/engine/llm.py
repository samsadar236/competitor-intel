"""The brain — extraction and synthesis via any OpenAI-compatible LLM.

Because Groq, Gemini, Ollama, OpenRouter, etc. all speak the OpenAI protocol,
this whole module talks to one `openai` client whose base_url / key / model come
from the environment. Switching providers is a `.env` change, not a code change.

Two jobs:
  * extract_record()  -> analyze one site's text into a CompetitorRecord
  * synthesize()      -> compare all records to the target and recommend moves

Robustness: calls retry on transient/rate-limit errors, and JSON is parsed
defensively (free models sometimes wrap output in prose or code fences).
"""
from __future__ import annotations

import json
import os
import re

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from .schema import CompetitorRecord, FetchStatus, Synthesis

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(
            base_url=os.environ.get("LLM_BASE_URL", "https://api.groq.com/openai/v1"),
            api_key=os.environ.get("LLM_API_KEY", "missing-key"),
        )
    return _client


def _model() -> str:
    return os.environ.get("LLM_MODEL", "llama-3.3-70b-versatile")


@retry(stop=stop_after_attempt(4), wait=wait_exponential(multiplier=2, min=2, max=30))
def _chat(system: str, user: str) -> str:
    """One chat completion. Retries on rate limits / transient errors."""
    resp = _get_client().chat.completions.create(
        model=_model(),
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},  # best-effort JSON nudge
    )
    return resp.choices[0].message.content or ""


def _parse_json(raw: str) -> dict:
    """Pull a JSON object out of a model response, tolerating fences/prose."""
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Grab the outermost {...} block as a fallback.
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


# ---- Extraction --------------------------------------------------------------

_EXTRACT_SYSTEM = """You are a competitor-research analyst. You are given the \
text of a company's website. Analyze ONLY what the text supports — never use \
outside knowledge, and never invent facts.

Return a single JSON object with EXACTLY these keys:
{
  "overview":        {"value": "...", "evidence": "short quote from the site", "source": "page url"},
  "services":        ["service 1", "service 2"],
  "target_audience": {"value": "...", "evidence": "...", "source": "..."},
  "website_structure": ["Home", "Services", "About", "Contact"],
  "content_strategy":  {"value": "...", "evidence": "...", "source": "..."},
  "seo_observations":  {"value": "notes on page titles/headings/internal linking", "evidence": "...", "source": "..."},
  "usp":               {"value": "...", "evidence": "...", "source": "..."},
  "pricing":           {"value": "... or 'not publicly listed'", "evidence": "...", "source": "..."},
  "strengths":       [{"value": "...", "evidence": "verbatim quote or ''", "source": "..."}],
  "weaknesses":      [{"value": "...", "evidence": "verbatim quote or ''", "source": "..."}]
}

Rules:
- Every "evidence" value MUST be a short quote copied VERBATIM (word for word) from
  the WEBSITE TEXT. Do NOT paraphrase, summarise, or put your own wording in an
  "evidence" field.
- If you cannot find a real verbatim quote to support a value, leave "evidence" as an
  empty string "". Never fabricate a quote. (This is common for seo_observations.)
- If pricing is not stated on the site, set pricing.value to "not publicly listed" and
  leave its evidence "".
- If something cannot be determined from the text, use an empty string / empty list.
  Never guess or rely on outside knowledge.
- Strengths and weaknesses each need a "value"; add a verbatim "evidence" quote only if
  one truly exists. Weaknesses are often the ABSENCE of something (e.g. no Medicare, no
  online booking) - for those, leave "evidence" "" rather than inventing a quote.
- Output ONLY the JSON object, nothing else."""


def extract_record(
    business_name: str,
    url: str,
    pages: list[dict],
    is_target: bool,
    fetch_status: str,
    fetch_notes: str,
) -> CompetitorRecord:
    """Analyze one site's fetched pages into a CompetitorRecord."""
    base = CompetitorRecord(
        business_name=business_name,
        url=url,
        is_target=is_target,
        fetch_status=FetchStatus(fetch_status),
        fetch_notes=fetch_notes,
        pages_analyzed=[p["url"] for p in pages],
    )

    if fetch_status == "failed" or not pages:
        base.overview = base.overview.model_copy(update={"value": "Site could not be accessed."})
        return base

    site_text = "\n\n".join(f"## PAGE: {p['url']}\n{p['text']}" for p in pages)
    user = f"Company: {business_name}\nWebsite: {url}\n\nWEBSITE TEXT:\n{site_text}"

    try:
        data = _parse_json(_chat(_EXTRACT_SYSTEM, user))
    except Exception as exc:  # noqa: BLE001 - degrade gracefully
        base.fetch_notes = (base.fetch_notes + f"; extraction failed: {exc}").strip("; ")
        base.fetch_status = FetchStatus.PARTIAL
        return base

    # Merge the analyzed fields onto the metadata we already have.
    merged = base.model_dump()
    for key, val in data.items():
        if key in merged:
            merged[key] = val
    return CompetitorRecord.model_validate(merged)


# ---- Synthesis ---------------------------------------------------------------

_SYNTH_SYSTEM = """You are a competitive-strategy analyst. You are given a \
profile of a TARGET business and several COMPETITORS, each tagged with an ID \
(c1, c2, ...). Compare them CONCRETELY and advise the target.

Return a single JSON object with EXACTLY these keys:
{
  "comparison": "A specific comparison. Name real differences between the target \
and each competitor - services, specialisms, pricing model, positioning. Refer \
to competitors by name. Avoid generic filler like 'operates in a competitive market'.",
  "recommendations": ["A specific, actionable move for the target, each grounded \
in a real gap versus a named competitor", "..."],
  "opportunities": {"c1": ["a concrete gap the target can exploit against this \
competitor", "..."], "c2": ["..."]}
}

Rules:
- In "opportunities", the keys MUST be the competitor IDs (c1, c2, ...) exactly.
- CRITICAL: every factual claim about a business (its services, pricing, audience,
  positioning) MUST match that business's profile exactly. Do NOT introduce any
  price, number, service, or fact that is not written in that profile.
- Pricing: use each business's pricing value exactly as given. If a profile says
  pricing is "not publicly listed", you MUST NOT state a price for it or claim it has
  clear/transparent pricing.
- "recommendations" and "opportunities" MAY propose new directions for the target,
  but must never misstate what any business currently offers.
- If a competitor's profile is empty (it could not be accessed), say it could not be
  assessed rather than guessing.
- Recommendations must be CONSISTENT with the target's own profile: never advise the
  target to start doing something it already does. For example, if the target already
  publishes its rates, do NOT recommend "more transparent pricing".
- Output ONLY the JSON object."""


def _profile_blurb(rec: CompetitorRecord, cid: str | None = None) -> str:
    header = f"### [{cid}] {rec.business_name}" if cid else f"### {rec.business_name} (TARGET)"
    return (
        f"{header}\n"
        f"Overview: {rec.overview.value}\n"
        f"Services: {', '.join(rec.services)}\n"
        f"Audience: {rec.target_audience.value}\n"
        f"USP: {rec.usp.value}\n"
        f"Pricing: {rec.pricing.value}\n"
        f"Strengths: {', '.join(s.value for s in rec.strengths)}\n"
        f"Weaknesses: {', '.join(w.value for w in rec.weaknesses)}\n"
    )


def synthesize(target: CompetitorRecord, competitors: list[CompetitorRecord]) -> Synthesis:
    """Produce the comparison + recommendations, and fill each competitor's
    opportunities_vs_target. Competitors are matched by a stable ID (c1, c2, ...)
    so the mapping can never break on names or URLs."""
    parts = [_profile_blurb(target)]
    for i, comp in enumerate(competitors, start=1):
        parts.append(_profile_blurb(comp, cid=f"c{i}"))
    profiles = "\n".join(parts)

    try:
        data = _parse_json(_chat(_SYNTH_SYSTEM, profiles))
        synth = Synthesis.model_validate(data)
    except Exception as exc:  # noqa: BLE001 - degrade gracefully
        return Synthesis(
            comparison=f"Synthesis step failed ({exc}). Per-competitor reports are still available.",
        )

    # Fold opportunities (keyed by ID) back onto the records - deterministic.
    for i, comp in enumerate(competitors, start=1):
        comp.opportunities_vs_target = synth.opportunities.get(f"c{i}", [])
    return synth
