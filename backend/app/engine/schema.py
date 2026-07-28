"""Data models — the contract the whole tool is built around.

Every website (the target business and each competitor) is analyzed into one
CompetitorRecord with exactly these fields. That fixed shape is what makes the
final side-by-side comparison possible.

Interpretive fields use `EvidenceField` so each conclusion carries the snippet
and the page it came from. This is the lightweight "faithfulness" idea borrowed
from ReportBench: a claim with no supporting evidence is a red flag, and it's
also why the model is told to write "not publicly listed" for missing pricing
instead of inventing a number.
"""
from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class FetchStatus(str, Enum):
    OK = "ok"          # homepage + all attempted pages fetched
    PARTIAL = "partial"  # homepage fetched, some pages failed
    FAILED = "failed"    # could not read the site at all


class EvidenceField(BaseModel):
    """An analyzed value plus the evidence it was drawn from."""
    value: str = Field(default="", description="The analyzed conclusion.")
    evidence: str = Field(default="", description="Short quote/snippet from the site supporting the value.")
    source: str = Field(default="", description="URL of the page the evidence came from.")


class CompetitorRecord(BaseModel):
    # --- identity / metadata (filled by the tool, not the LLM) ---
    business_name: str = ""
    url: str = ""
    is_target: bool = False
    fetch_status: FetchStatus = FetchStatus.OK
    fetch_notes: str = ""
    pages_analyzed: list[str] = Field(default_factory=list)

    # --- analyzed fields (filled by the LLM from the site's text) ---
    overview: EvidenceField = Field(default_factory=EvidenceField)
    services: list[str] = Field(default_factory=list)
    target_audience: EvidenceField = Field(default_factory=EvidenceField)
    website_structure: list[str] = Field(default_factory=list)
    content_strategy: EvidenceField = Field(default_factory=EvidenceField)
    seo_observations: EvidenceField = Field(default_factory=EvidenceField)
    usp: EvidenceField = Field(default_factory=EvidenceField)
    pricing: EvidenceField = Field(default_factory=EvidenceField)  # "not publicly listed" if absent
    strengths: list[EvidenceField] = Field(default_factory=list)
    weaknesses: list[EvidenceField] = Field(default_factory=list)

    # --- filled during synthesis (needs the target for context) ---
    opportunities_vs_target: list[str] = Field(default_factory=list)


class Synthesis(BaseModel):
    """Output of the final comparison step."""
    comparison: str = ""                 # narrative comparing all competitors to the target
    recommendations: list[str] = Field(default_factory=list)  # top moves for the target
    opportunities: dict[str, list[str]] = Field(default_factory=dict)  # competitor_name -> opportunities
