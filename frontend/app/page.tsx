import { Shell } from "@/components/layout/Shell";
import { AnalysisForm } from "@/components/analysis/AnalysisForm";
import { RecentAnalyses } from "@/components/dashboard/RecentAnalyses";
import { SidePanels } from "@/components/dashboard/SidePanels";

export default function NewAnalysisPage() {
  return (
    <Shell title="InsightEngine AI">
      <div className="p-margin-desktop max-w-[1200px] mx-auto w-full">
        <section className="mb-xl">
          <h2 className="text-headline-lg text-primary mb-2">AI Competitor Intelligence Agent</h2>
          <p className="text-body-lg text-on-surface-variant max-w-3xl">
            Point it at a business and its competitors. It reads their public websites, analyzes each on a fixed set of criteria with source-backed evidence, and produces a comparison and strategic recommendations.
          </p>
        </section>

        <AnalysisForm />

        <div className="mt-2xl grid grid-cols-1 lg:grid-cols-3 gap-lg">
          <div className="lg:col-span-2"><RecentAnalyses /></div>
          <SidePanels />
        </div>
      </div>
    </Shell>
  );
}
