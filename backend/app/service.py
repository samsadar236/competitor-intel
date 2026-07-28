"""Service layer — runs the engine and shapes its output into the API response.

This is the only place the engine (snake_case records) meets the API
(camelCase models). The engine itself is untouched.
"""
from __future__ import annotations

import os
from datetime import datetime, timezone
from urllib.parse import urlparse

from .engine import fetch, llm  # module-qualified so calls stay easy to test/mock
from .schemas import AnalyzeResponse, Evidence, Metrics, SiteReport


def _name_from_url(url: str) -> str:
    """Derive a readable display name from a URL's hostname."""
    host = urlparse(url if "://" in url else f"https://{url}").netloc
    return host.replace("www.", "") or url


def _ev(field) -> Evidence:
    return Evidence(value=field.value, evidence=field.evidence, source=field.source)


def _to_report(rec) -> SiteReport:
    """Map an engine CompetitorRecord onto the camelCase SiteReport."""
    return SiteReport(
        businessName=rec.business_name,
        url=rec.url,
        isTarget=rec.is_target,
        fetchStatus=rec.fetch_status.value,
        fetchNotes=rec.fetch_notes,
        pagesAnalyzed=rec.pages_analyzed,
        overview=_ev(rec.overview),
        services=rec.services,
        targetAudience=_ev(rec.target_audience),
        websiteStructure=rec.website_structure,
        contentStrategy=_ev(rec.content_strategy),
        seoObservations=_ev(rec.seo_observations),
        usp=_ev(rec.usp),
        pricing=_ev(rec.pricing),
        strengths=[_ev(s) for s in rec.strengths],
        weaknesses=[_ev(w) for w in rec.weaknesses],
        opportunitiesVsTarget=rec.opportunities_vs_target,
    )


def _analyze_one(url: str, is_target: bool):
    pages, status, notes = fetch.fetch_site(
        url,
        max_pages=int(os.getenv("MAX_PAGES_PER_SITE", "5")),
        max_chars=int(os.getenv("MAX_CHARS_PER_SITE", "30000")),
        timeout=int(os.getenv("REQUEST_TIMEOUT", "20")),
    )
    return llm.extract_record(
        business_name=_name_from_url(url),
        url=url,
        pages=pages,
        is_target=is_target,
        fetch_status=status,
        fetch_notes=notes,
    )


def run_analysis(target_url: str, competitor_urls: list[str]) -> AnalyzeResponse:
    """Full pipeline: fetch + extract each site, synthesize, shape the response."""
    target_rec = _analyze_one(target_url, is_target=True)
    competitor_recs = [_analyze_one(u, is_target=False) for u in competitor_urls]

    synth = llm.synthesize(target_rec, competitor_recs)  # also fills opportunities

    all_recs = [target_rec, *competitor_recs]
    metrics = Metrics(
        competitorsAnalyzed=len(competitor_recs),
        sitesReachable=sum(1 for r in all_recs if r.fetch_status.value != "failed"),
        pricingPublished=sum(
            1 for r in competitor_recs
            if r.pricing.value and r.pricing.value.strip().lower() != "not publicly listed"
        ),
    )

    return AnalyzeResponse(
        target=_to_report(target_rec),
        competitors=[_to_report(r) for r in competitor_recs],
        comparison=synth.comparison,
        recommendations=synth.recommendations,
        metrics=metrics,
        generatedAt=datetime.now(timezone.utc).isoformat(),
    )
