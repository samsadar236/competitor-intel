// Mirrors the FastAPI AnalyzeResponse (backend/app/schemas.py). Keep in sync.

export interface Evidence {
  value: string;
  evidence: string;
  source: string;
}

export type FetchStatus = "ok" | "partial" | "failed";

export interface SiteReport {
  businessName: string;
  url: string;
  isTarget: boolean;
  fetchStatus: FetchStatus;
  fetchNotes: string;
  pagesAnalyzed: string[];
  overview: Evidence;
  services: string[];
  targetAudience: Evidence;
  websiteStructure: string[];
  contentStrategy: Evidence;
  seoObservations: Evidence;
  usp: Evidence;
  pricing: Evidence;
  strengths: Evidence[];
  weaknesses: Evidence[];
  opportunitiesVsTarget: string[];
}

export interface Metrics {
  competitorsAnalyzed: number;
  sitesReachable: number;
  pricingPublished: number;
}

export interface AnalyzeResponse {
  target: SiteReport;
  competitors: SiteReport[];
  comparison: string;
  recommendations: string[];
  metrics: Metrics;
  generatedAt: string;
}

export interface AnalyzeRequest {
  targetUrl: string;
  competitorUrls: string[];
}
