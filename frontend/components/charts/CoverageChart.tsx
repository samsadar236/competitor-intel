"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { AnalyzeResponse, SiteReport } from "@/types/report";
import { cn } from "@/lib/utils";

const short = (s: SiteReport) => s.businessName.split(".")[0].slice(0, 12);
const priced = (s: SiteReport) => (s.pricing.value && s.pricing.value.toLowerCase() !== "not publicly listed" ? 1 : 0);

function Card({ title, subtitle, children, className }: { title: string; subtitle: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white p-xl rounded-2xl border border-outline-variant shadow-sm hover-lift", className)}>
      <div className="mb-lg">
        <h3 className="text-headline-sm font-bold">{title}</h3>
        <p className="text-label-sm text-on-surface-variant">{subtitle}</p>
      </div>
      <div className="h-[320px] w-full">{children}</div>
    </div>
  );
}

export function CoverageCharts({ report }: { report: AnalyzeResponse }) {
  const all = [report.target, ...report.competitors];
  const barData = all.map((s) => ({ name: short(s), Services: s.services.length, Strengths: s.strengths.length, Weaknesses: s.weaknesses.length }));

  const axes = ["Services", "Pages", "Structure", "Strengths"] as const;
  const max = {
    Services: Math.max(1, ...all.map((s) => s.services.length)),
    Pages: Math.max(1, ...all.map((s) => s.pagesAnalyzed.length)),
    Structure: Math.max(1, ...all.map((s) => s.websiteStructure.length)),
    Strengths: Math.max(1, ...all.map((s) => s.strengths.length)),
  };
  const norm = (s: SiteReport) =>
    axes.map((a) => ({
      axis: a,
      value: Math.round(
        ((a === "Services" ? s.services.length : a === "Pages" ? s.pagesAnalyzed.length : a === "Structure" ? s.websiteStructure.length : s.strengths.length) / max[a]) * 100,
      ),
    }));
  const top = report.competitors[0];
  const radarData = axes.map((a, i) => ({ axis: a, Target: norm(report.target)[i].value, ...(top ? { Competitor: norm(top)[i].value } : {}) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
      <Card title="Content Footprint" subtitle="Counts extracted from each site (higher = more surfaced)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Services" fill="#2170e4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Strengths" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Weaknesses" fill="#e5a3a3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Coverage Profile" subtitle="Target vs closest competitor, normalized to 100 (based on extracted data)">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="70%">
            <PolarGrid />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar name="Target" dataKey="Target" stroke="#2170e4" fill="#2170e4" fillOpacity={0.3} />
            {top && <Radar name={short(top)} dataKey="Competitor" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />}
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

export { priced };
