"use client";
import { motion } from "framer-motion";
import { Users, Globe2, BadgeDollarSign, Lightbulb } from "lucide-react";
import type { AnalyzeResponse } from "@/types/report";

export function KpiCards({ report }: { report: AnalyzeResponse }) {
  const opps = report.competitors.reduce((n, c) => n + c.opportunitiesVsTarget.length, 0);
  const cards = [
    { icon: Users, label: "Competitors Analyzed", value: report.metrics.competitorsAnalyzed },
    { icon: Globe2, label: "Sites Reachable", value: `${report.metrics.sitesReachable}/${report.competitors.length + 1}` },
    { icon: BadgeDollarSign, label: "Publish Pricing", value: `${report.metrics.pricingPublished}/${report.competitors.length}` },
    { icon: Lightbulb, label: "Opportunities Found", value: opps },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
      {cards.map((c, i) => (
        <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white p-lg rounded-2xl border border-outline-variant hover-lift">
          <c.icon size={20} className="text-secondary bg-secondary/10 p-0.5 rounded-lg mb-4 w-8 h-8" />
          <div className="text-display-lg font-black leading-none">{c.value}</div>
          <div className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold mt-2">{c.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
