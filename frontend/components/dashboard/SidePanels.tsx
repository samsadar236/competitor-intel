import { Sparkles, ListChecks } from "lucide-react";

const STEPS = ["Fetches each site's public pages", "Extracts a fixed schema with source quotes", "Compares competitors and recommends moves"];

export function SidePanels() {
  return (
    <div className="space-y-lg">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-20px p-lg premium-shadow">
        <h4 className="text-label-sm uppercase tracking-widest font-bold text-on-surface-variant mb-md flex items-center gap-2"><ListChecks size={16} /> How it works</h4>
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3 text-body-sm">
              <span className="w-6 h-6 shrink-0 rounded-full bg-secondary/10 text-secondary font-bold text-xs flex items-center justify-center">{i + 1}</span>
              <span className="text-on-surface-variant">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-primary text-white rounded-20px p-lg premium-shadow relative overflow-hidden">
        <Sparkles className="absolute -right-3 -top-3 opacity-10" size={96} />
        <div className="flex items-center gap-2 mb-sm">
          <Sparkles size={14} />
          <span className="font-bold text-[10px] uppercase tracking-widest">Tip</span>
        </div>
        <p className="text-body-sm leading-relaxed">Pick competitors in the same niche and region as your business — the comparison and recommendations are only as good as the peer set you choose.</p>
      </div>
    </div>
  );
}
