import * as React from "react";
import { cn } from "@/utils/cn";

const tones = {
  cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  mint: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  violet: "border-violet-300/30 bg-violet-300/10 text-violet-100",
  rose: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  amber: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  slate: "border-white/10 bg-white/[0.06] text-slate-300",
};

export function Badge({
  className,
  tone = "slate",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
