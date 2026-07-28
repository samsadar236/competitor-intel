import type { AnalyzeRequest, AnalyzeResponse } from "@/types/report";
import { mockReport } from "@/lib/mock-data";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** Calls POST /api/analyze on the FastAPI backend (or returns mock data). */
export async function analyzeCompetitors(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  if (USE_MOCK) {
    // Simulate work so the loading workflow is visible during development.
    await new Promise((r) => setTimeout(r, 5000));
    return mockReport;
  }
  const res = await fetch(`${BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? `Analysis request failed (${res.status})`);
  }
  return (await res.json()) as AnalyzeResponse;
}
