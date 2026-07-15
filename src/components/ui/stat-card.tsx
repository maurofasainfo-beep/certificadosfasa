import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type StatCardProps = {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
};

const tones = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-green-50 text-green-700 ring-green-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function StatCard({ title, value, description, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 transition duration-150 hover:border-slate-300">
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500" title={typeof title === "string" ? title : undefined}>{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-normal text-slate-950">{value}</p>
        </div>
        {Icon ? (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1", tones[tone])}>
            <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
          </div>
        ) : null}
      </div>
      {description ? <p className="relative mt-2 text-sm leading-5 text-slate-600" title={description}>{description}</p> : null}
    </article>
  );
}
