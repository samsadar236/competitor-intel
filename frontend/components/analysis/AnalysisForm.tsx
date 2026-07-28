"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Globe, Link2, Plus, X, Zap, ShieldCheck, LayoutGrid, DollarSign, AlertCircle } from "lucide-react";
import { analyzeCompetitors } from "@/lib/api";
import { useReport } from "@/app/providers";
import { LoadingWorkflow } from "./LoadingWorkflow";

const schema = z.object({
  targetUrl: z.string().min(3, "Enter your business website"),
  competitors: z
    .array(z.object({ url: z.string().min(3, "Enter a competitor website") }))
    .min(1, "Add at least one competitor"),
});
type FormValues = z.infer<typeof schema>;

export function AnalysisForm() {
  const router = useRouter();
  const { setReport } = useReport();

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { targetUrl: "", competitors: [{ url: "" }, { url: "" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "competitors" });

  const mutation = useMutation({
    mutationFn: analyzeCompetitors,
    onSuccess: (data) => {
      setReport(data);
      router.push("/report");
    },
  });

  const onSubmit = (values: FormValues) =>
    mutation.mutate({ targetUrl: values.targetUrl, competitorUrls: values.competitors.map((c) => c.url) });

  return (
    <div className="relative bg-surface-container-lowest border border-outline-variant rounded-20px p-xl premium-shadow overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        {/* Inputs */}
        <div className="space-y-lg">
          <div>
            <label className="block text-label-md text-on-surface-variant mb-2">Target Business URL</label>
            <div className="relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input
                {...register("targetUrl")}
                placeholder="https://your-business.com"
                className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl outline-none focus:border-primary transition-all"
              />
            </div>
            {errors.targetUrl && <p className="text-error text-xs mt-1">{errors.targetUrl.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-label-md text-on-surface-variant">Competitor URLs</label>
              <button type="button" onClick={() => append({ url: "" })} className="text-primary text-label-md font-bold hover:underline flex items-center gap-1">
                <Plus size={16} /> Add Competitor
              </button>
            </div>
            <div className="space-y-sm">
              {fields.map((field, i) => (
                <div key={field.id} className="relative group">
                  <Link2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    {...register(`competitors.${i}.url` as const)}
                    placeholder={`https://competitor-${i + 1}.com`}
                    className="w-full pl-12 pr-12 py-3 bg-white border border-outline-variant rounded-xl outline-none focus:border-primary transition-all"
                  />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} aria-label="Remove" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-error transition-colors">
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.competitors && <p className="text-error text-xs mt-1">{errors.competitors.message ?? errors.competitors.root?.message}</p>}
          </div>

          {mutation.isError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-error-container/40 text-on-error-container text-body-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{(mutation.error as Error).message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-body-lg hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <Zap size={20} /> {mutation.isPending ? "Analyzing…" : "Start Intelligent Analysis"}
          </button>
        </div>

        {/* Info panel */}
        <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <h4 className="text-headline-sm font-bold mb-md flex items-center gap-2"><ShieldCheck size={20} className="text-secondary" /> What you get</h4>
            <ul className="space-y-md">
              <InfoItem icon={<LayoutGrid size={18} className="text-secondary" />} title="Evidence-grounded analysis" body="Overview, services, audience, SEO, USP, strengths and weaknesses — each backed by a real quote from the site." />
              <InfoItem icon={<DollarSign size={18} className="text-secondary" />} title="Pricing & comparison" body="Published rates where available, plus a side-by-side comparison and recommendations." />
            </ul>
          </div>
          <p className="mt-xl p-md bg-white border border-outline-variant/50 rounded-lg text-xs text-on-surface-variant">
            Analysis uses only publicly available page content. Missing data (e.g. unlisted pricing) is reported as “not publicly listed,” never invented.
          </p>
        </div>
      </form>

      <LoadingWorkflow active={mutation.isPending} />
    </div>
  );
}

function InfoItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">{icon}</div>
      <div>
        <p className="text-label-md text-on-surface">{title}</p>
        <p className="text-xs text-on-surface-variant">{body}</p>
      </div>
    </li>
  );
}
