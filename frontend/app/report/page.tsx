"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { useReport } from "@/app/providers";
import { mockReport } from "@/lib/mock-data";
import type { AnalyzeResponse } from "@/types/report";
import { ExecutiveSummary } from "@/components/report/ExecutiveSummary";
import { KpiCards } from "@/components/report/KpiCards";
import { SwotSection } from "@/components/report/SwotSection";
import { ComparisonTable } from "@/components/report/ComparisonTable";
import { CoverageCharts } from "@/components/charts/CoverageChart";
import { Recommendations } from "@/components/report/Recommendations";
import { SourcesPanel } from "@/components/report/SourcesPanel";
import { ReportActions } from "@/components/report/ReportActions";

export default function ReportPage() {
  const { report: stored } = useReport();
  const [report, setReport] = useState<AnalyzeResponse | null>(stored);

  // Hydrate on refresh: prefer the in-memory store, then sessionStorage, then mock.
  useEffect(() => {
    if (report) return;
    try {
      const raw = sessionStorage.getItem("report");
      setReport(raw ? (JSON.parse(raw) as AnalyzeResponse) : mockReport);
    } catch {
      setReport(mockReport);
    }
  }, [report]);

  if (!report) return null;

  return (
    <Shell title="Strategic Research Report">
      <div className="p-margin-desktop max-w-[1440px] mx-auto w-full space-y-xl pb-32">
        <Link href="/" className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-on-surface transition-colors">
          <ArrowLeft size={16} /> New analysis
        </Link>

        <ExecutiveSummary report={report} />
        <KpiCards report={report} />
        <SwotSection report={report} />
        <ComparisonTable report={report} />
        <CoverageCharts report={report} />
        <Recommendations report={report} />
        <SourcesPanel report={report} />
      </div>
      <ReportActions report={report} />
    </Shell>
  );
}
