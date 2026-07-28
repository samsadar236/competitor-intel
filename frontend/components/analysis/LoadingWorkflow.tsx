"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ShoppingBag, DollarSign, Grid3x3, GitCompareArrows, FileText, Check, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Crawling websites", icon: Globe },
  { label: "Extracting services", icon: ShoppingBag },
  { label: "Identifying pricing", icon: DollarSign },
  { label: "Running SWOT analysis", icon: Grid3x3 },
  { label: "Comparing competitors", icon: GitCompareArrows },
  { label: "Generating strategic report", icon: FileText },
];

/** Overlay that walks through the pipeline stages while `active` is true.
 * Progress is indicative (the backend call is a single request), so it advances
 * on a timer and holds on the final stage until the real result returns. */
export function LoadingWorkflow({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 8000);
    return () => clearInterval(id);
  }, [active]);

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-xl glass-panel rounded-20px"
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-lg">
              <div className="w-16 h-16 mx-auto mb-md rounded-full bg-secondary/10 flex items-center justify-center">
                <Loader2 className="text-secondary animate-spin" size={28} />
              </div>
              <h4 className="text-headline-sm font-bold">Synthesizing competitor intelligence</h4>
              <p className="text-body-sm text-on-surface-variant mt-1">This usually takes a minute or two.</p>
            </div>

            <div className="space-y-2">
              {STEPS.map((s, i) => {
                const done = i < step;
                const current = i === step;
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    animate={{ opacity: done || current ? 1 : 0.4 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border bg-white ${current ? "border-secondary" : "border-outline-variant"}`}
                  >
                    <span className={done ? "text-secondary" : current ? "text-secondary" : "text-outline"}>
                      {done ? <Check size={18} /> : current ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />}
                    </span>
                    <span className="text-label-md flex-1">{s.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-lg h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <motion.div className="h-full bg-secondary" animate={{ width: `${pct}%` }} transition={{ ease: "easeOut" }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
