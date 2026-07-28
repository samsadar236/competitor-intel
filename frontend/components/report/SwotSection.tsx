"use client";
import { Star, Ban, Compass, Shield } from "lucide-react";
import type { AnalyzeResponse, Evidence } from "@/types/report";

function Quad({ title, icon, accent, items }: { title: string; icon: React.ReactNode; accent: string; items: { text: string; quote?: string; source?: string }[] }) {
  return (
    <div className="p-xl rounded-2xl border hover-lift bg-white" style={{ borderColor: `${accent}22` }}>
      <div className="flex items-center gap-3 mb-lg">
        <span className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: accent }}>{icon}</span>
        <span className="text-headline-sm font-bold" style={{ color: accent }}>{title}</span>
      </div>
      <ul className="space-y-3">
        {items.length ? items.map((it, i) => (
          <li key={i} className="text-body-md text-on-surface-variant">
            <span className="font-medium text-on-surface">{it.text}</span>
            {it.quote && <span className="block text-xs italic text-on-surface-variant/70 mt-0.5 border-l-2 pl-2" style={{ borderColor: accent }}>“{it.quote}”</span>}
          </li>
        )) : <li className="text-body-sm text-on-surface-variant/60">None found.</li>}
      </ul>
    </div>
  );
}

const fromEv = (e: Evidence[]) => e.map((x) => ({ text: x.value, quote: x.evidence || undefined, source: x.source }));

export function SwotSection({ report }: { report: AnalyzeResponse }) {
  const opportunities = report.competitors.flatMap((c) => c.opportunitiesVsTarget.map((o) => ({ text: o })));
  const threats = report.competitors.flatMap((c) => c.strengths.map((s) => ({ text: `${c.businessName}: ${s.value}` })));
  return (
    <section>
      <h3 className="text-headline-sm font-bold mb-md">SWOT — {report.target.businessName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <Quad title="Strengths" icon={<Star size={18} />} accent="#0058be" items={fromEv(report.target.strengths)} />
        <Quad title="Weaknesses" icon={<Ban size={18} />} accent="#ba1a1a" items={fromEv(report.target.weaknesses)} />
        <Quad title="Opportunities" icon={<Compass size={18} />} accent="#6d28d9" items={opportunities} />
        <Quad title="Threats (competitor strengths)" icon={<Shield size={18} />} accent="#45464c" items={threats} />
      </div>
    </section>
  );
}
