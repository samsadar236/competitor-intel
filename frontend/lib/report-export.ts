import type { AnalyzeResponse, SiteReport } from "@/types/report";

function siteToMd(s: SiteReport): string {
  const ev = (label: string, f: { value: string }) => `**${label}:** ${f.value || "—"}`;
  const list = (label: string, items: string[]) => `**${label}:** ${items.length ? items.join(", ") : "—"}`;
  const evList = (label: string, items: { value: string }[]) => `**${label}:**\n${items.length ? items.map((i) => `- ${i.value}`).join("\n") : "- —"}`;
  return [
    `## ${s.businessName}${s.isTarget ? " (Target)" : ""}`,
    `${s.url} — fetch: ${s.fetchStatus}`,
    ev("Overview", s.overview),
    list("Services", s.services),
    ev("Audience", s.targetAudience),
    ev("USP", s.usp),
    ev("Pricing", s.pricing),
    evList("Strengths", s.strengths),
    evList("Weaknesses", s.weaknesses),
    s.opportunitiesVsTarget.length ? `**Opportunities for target:**\n${s.opportunitiesVsTarget.map((o) => `- ${o}`).join("\n")}` : "",
  ].filter(Boolean).join("\n\n");
}

export function reportToMarkdown(r: AnalyzeResponse): string {
  return [
    `# Competitor Research Report`,
    `_Generated ${new Date(r.generatedAt).toLocaleString()}_`,
    `## Comparison\n${r.comparison}`,
    `## Recommendations\n${r.recommendations.map((x) => `- ${x}`).join("\n")}`,
    siteToMd(r.target),
    ...r.competitors.map(siteToMd),
  ].join("\n\n");
}

export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
