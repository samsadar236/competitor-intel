"use client";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { AnalyzeResponse } from "@/types/report";

const ACCENTS = ["#ba1a1a", "#0058be", "#6d28d9"];

export function Recommendations({ report }: { report: AnalyzeResponse }) {
  return (
    <section>
      <h3 className="text-headline-sm font-bold flex items-center gap-2 mb-md"><Lightbulb size={20} className="text-secondary" /> Strategic Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {report.recommendations.map((rec, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white p-lg rounded-2xl border border-outline-variant border-l-8 hover-lift shadow-sm" style={{ borderLeftColor: ACCENTS[i % ACCENTS.length] }}>
            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full" style={{ background: `${ACCENTS[i % ACCENTS.length]}15`, color: ACCENTS[i % ACCENTS.length] }}>Priority {i + 1}</span>
            <p className="text-body-md text-on-surface mt-3 leading-relaxed">{rec}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
