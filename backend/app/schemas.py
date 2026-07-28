"""API request/response models.

These are the public contract the Next.js frontend consumes, so field names
are camelCase (JS convention). They mirror the engine's internal snake_case
records; `service.py` maps between the two. Everything here comes from real
engine output — nothing is fabricated.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class Evidence(BaseModel):
    """An analyzed value plus the verbatim quote and page it came from."""
    value: str = ""
    evidence: str = ""
    source: str = ""


class SiteReport(BaseModel):
    """The full analysis of one website (the target or a competitor)."""
    businessName: str
    url: str
    isTarget: bool = False
    fetchStatus: Literal["ok", "partial", "failed"] = "ok"
    fetchNotes: str = ""
    pagesAnalyzed: list[str] = Field(default_factory=list)

    overview: Evidence = Field(default_factory=Evidence)
    services: list[str] = Field(default_factory=list)
    targetAudience: Evidence = Field(default_factory=Evidence)
    websiteStructure: list[str] = Field(default_factory=list)
    contentStrategy: Evidence = Field(default_factory=Evidence)
    seoObservations: Evidence = Field(default_factory=Evidence)
    usp: Evidence = Field(default_factory=Evidence)
    pricing: Evidence = Field(default_factory=Evidence)
    strengths: list[Evidence] = Field(default_factory=list)
    weaknesses: list[Evidence] = Field(default_factory=list)
    opportunitiesVsTarget: list[str] = Field(default_factory=list)


class Metrics(BaseModel):
    """Honest, derived headline numbers for the KPI cards."""
    competitorsAnalyzed: int
    sitesReachable: int
    pricingPublished: int  # how many competitors publish a rate


class AnalyzeRequest(BaseModel):
    targetUrl: str
    competitorUrls: list[str]


class AnalyzeResponse(BaseModel):
    target: SiteReport
    competitors: list[SiteReport]
    comparison: str
    recommendations: list[str]
    metrics: Metrics
    generatedAt: str
