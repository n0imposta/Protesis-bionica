import { cn } from "@/utils/cn";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-white/[0.08]", className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-300" style={{ width: `${value}%` }} />
    </div>
  );
}
