"use client";
import { Link2 } from "lucide-react";
import type { AnalyzeResponse } from "@/types/report";

export function SourcesPanel({ report }: { report: AnalyzeResponse }) {
  const sites = [report.target, ...report.competitors];
  return (
    <section>
      <h3 className="text-headline-sm font-bold flex items-center gap-2 mb-md"><Link2 size={20} className="text-on-surface-variant" /> Sources</h3>
      <p className="text-body-sm text-on-surface-variant mb-md">Every claim is drawn only from these public pages the agent actually read.</p>
      <div className="bg-white border border-outline-variant rounded-2xl divide-y divide-outline-variant overflow-hidden">
        {sites.map((s) => (
          <div key={s.url} className="p-lg">
            <p className="text-label-md font-bold mb-2">{s.businessName}</p>
            <ul className="space-y-1">
              {s.pagesAnalyzed.length ? s.pagesAnalyzed.map((p) => (
                <li key={p}><a href={p} target="_blank" rel="noopener noreferrer" className="text-body-sm text-secondary hover:underline break-all">{p}</a></li>
              )) : <li className="text-body-sm text-on-surface-variant/60">Site could not be read.</li>}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
