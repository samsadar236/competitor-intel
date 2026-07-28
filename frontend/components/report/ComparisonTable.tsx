"use client";
import type { AnalyzeResponse, SiteReport } from "@/types/report";
import { cn } from "@/lib/utils";

const cells = (s: SiteReport) => [
  s.services.join(", ") || "—",
  s.targetAudience.value || "—",
  s.usp.value || "—",
  s.pricing.value || "—",
];
const COLS = ["Services", "Audience", "USP", "Pricing"];

export function ComparisonTable({ report }: { report: AnalyzeResponse }) {
  const rows = [report.target, ...report.competitors];
  return (
    <section className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
      <div className="px-xl py-lg border-b border-outline-variant">
        <h3 className="text-headline-sm font-bold">Side-by-side Comparison</h3>
        <p className="text-label-sm text-on-surface-variant mt-1">Target vs {report.competitors.length} competitor{report.competitors.length === 1 ? "" : "s"}</p>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[820px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-xl py-4 text-label-sm uppercase tracking-widest font-black text-on-surface-variant sticky left-0 bg-surface-container-low">Business</th>
              {COLS.map((c) => <th key={c} className="px-lg py-4 text-label-sm uppercase tracking-widest font-black text-on-surface-variant">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {rows.map((s) => (
              <tr key={s.url} className={cn("align-top hover:bg-surface-container/40 transition-colors", s.isTarget && "bg-secondary/5")}>
                <td className={cn("px-xl py-4 sticky left-0 bg-white", s.isTarget && "bg-secondary/5")}>
                  <div className="font-bold text-on-surface">{s.businessName}</div>
                  <div className="text-[10px] text-on-surface-variant/70 mt-0.5">
                    {s.isTarget ? "TARGET" : "Competitor"} · {s.fetchStatus}
                  </div>
                </td>
                {cells(s).map((val, i) => <td key={i} className="px-lg py-4 text-body-sm text-on-surface-variant max-w-[240px]">{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
