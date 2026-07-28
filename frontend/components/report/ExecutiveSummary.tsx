"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AnalyzeResponse } from "@/types/report";

export function ExecutiveSummary({ report }: { report: AnalyzeResponse }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-xl border border-outline-variant shadow-sm ai-gradient-border">
      <div className="flex items-center gap-sm mb-lg">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><Sparkles size={20} /></div>
        <h3 className="text-headline-sm font-bold">Executive Summary</h3>
        <span className="ml-auto text-label-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">for {report.target.businessName}</span>
      </div>
      <p className="text-body-lg text-on-surface-variant leading-relaxed">{report.comparison}</p>
    </motion.div>
  );
}
