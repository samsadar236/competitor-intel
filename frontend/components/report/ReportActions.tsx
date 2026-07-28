"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Braces, Printer, MessageSquare, X, Sparkles } from "lucide-react";
import type { AnalyzeResponse } from "@/types/report";
import { reportToMarkdown, download } from "@/lib/report-export";

export function ReportActions({ report }: { report: AnalyzeResponse }) {
  const [chatOpen, setChatOpen] = useState(false);

  const exportMarkdown = () => download("competitor-report.md", reportToMarkdown(report), "text/markdown");
  const exportJson = () => download("competitor-report.json", JSON.stringify(report, null, 2), "application/json");

  return (
    <>
      {/* Export bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 print:hidden">
        <div className="glass-panel px-lg py-3 rounded-full shadow-2xl flex items-center gap-2">
          <span className="hidden md:block text-label-sm uppercase tracking-widest font-black text-on-surface-variant mr-2">Export</span>
          <ActionBtn icon={<FileText size={16} />} label="Markdown" onClick={exportMarkdown} />
          <ActionBtn icon={<Braces size={16} />} label="JSON" onClick={exportJson} />
          <ActionBtn icon={<Printer size={16} />} label="PDF" onClick={() => window.print()} />
        </div>
      </div>

      {/* Chat */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-md print:hidden">
        <AnimatePresence>
          {chatOpen && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="glass-panel w-[320px] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-md bg-primary text-white flex justify-between items-center">
                <span className="flex items-center gap-2 font-bold text-label-md"><Sparkles size={16} /> Insight Assistant</span>
                <button onClick={() => setChatOpen(false)} aria-label="Close"><X size={18} /></button>
              </div>
              <div className="p-lg bg-surface-container-low/50">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-outline-variant text-label-sm">
                  A conversational assistant over this report is on the roadmap — for now, the full analysis is in the sections above.
                </div>
              </div>
              <div className="p-md bg-white border-t border-outline-variant">
                <input disabled placeholder="Chat coming soon…" className="w-full bg-surface-container-high rounded-full py-2 px-4 text-label-sm opacity-60" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setChatOpen((v) => !v)} aria-label="Assistant" className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <MessageSquare size={22} />
        </button>
      </div>
    </>
  );
}

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-surface-container-high border border-outline-variant rounded-full text-label-sm font-bold shadow-sm transition-all">
      {icon} {label}
    </button>
  );
}
