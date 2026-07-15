import type { ReactNode } from "react";

export function FilterBar({ children, columns = "md:grid-cols-[1fr_auto]" }: { children: ReactNode; columns?: string }) {
  return (
    <form className={`mb-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-950/5 sm:gap-2.5 [&>button]:w-full sm:[&>button]:w-auto ${columns}`}>
      {children}
    </form>
  );
}
