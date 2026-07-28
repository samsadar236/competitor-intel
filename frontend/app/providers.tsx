"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useState } from "react";
import type { AnalyzeResponse } from "@/types/report";

interface ReportStore {
  report: AnalyzeResponse | null;
  setReport: (r: AnalyzeResponse) => void;
}
const ReportContext = createContext<ReportStore | null>(null);

export function useReport(): ReportStore {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used within <Providers>");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [report, setReportState] = useState<AnalyzeResponse | null>(null);
  const store = useMemo<ReportStore>(
    () => ({
      report,
      setReport: (r) => {
        setReportState(r);
        try { sessionStorage.setItem("report", JSON.stringify(r)); } catch { /* ignore */ }
      },
    }),
    [report],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReportContext.Provider value={store}>{children}</ReportContext.Provider>
    </QueryClientProvider>
  );
}
