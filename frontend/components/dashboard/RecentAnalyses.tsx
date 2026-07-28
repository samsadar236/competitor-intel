"use client";

// Illustrative recent-analyses list (UI chrome). Real history would come from a
// persistence layer, which is out of scope for v1.
const ROWS = [
  { initials: "FB", name: "Fresh Breath Therapy", competitors: "Prism Wellness, AlphaMind…", date: "Today", status: "Complete" },
  { initials: "VC", name: "Vercel Inc.", competitors: "Netlify, Cloudflare…", date: "Oct 24", status: "Complete" },
  { initials: "LN", name: "Linear", competitors: "Jira, Shortcut", date: "Oct 19", status: "Archived" },
];

export function RecentAnalyses() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-20px overflow-hidden premium-shadow">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center">
        <h4 className="text-headline-sm font-bold">Recent Analyses</h4>
        <span className="text-label-sm text-on-surface-variant/60">Example entries</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/50 text-on-surface-variant">
              <th className="px-lg py-3 text-label-md font-medium">Target</th>
              <th className="px-lg py-3 text-label-md font-medium">Competitors</th>
              <th className="px-lg py-3 text-label-md font-medium">Date</th>
              <th className="px-lg py-3 text-label-md font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {ROWS.map((r) => (
              <tr key={r.name} className="hover:bg-surface-container-low/40 transition-colors">
                <td className="px-lg py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-secondary-container/15 text-secondary flex items-center justify-center font-bold text-xs">{r.initials}</div>
                    <span className="text-label-md">{r.name}</span>
                  </div>
                </td>
                <td className="px-lg py-3 text-body-sm text-on-surface-variant">{r.competitors}</td>
                <td className="px-lg py-3 text-body-sm text-on-surface-variant">{r.date}</td>
                <td className="px-lg py-3 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${r.status === "Complete" ? "bg-green-100 text-green-700" : "bg-surface-container-high text-on-surface-variant"}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
