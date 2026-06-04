"use client";

import type { Trend } from "@/types/domain";
import { useEffect, useState } from "react";
import { Scatter, ScatterChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

export function TrendsChart({ data }: { data: Trend[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-[430px] rounded-md bg-white/[0.03]" />;
  }

  return (
    <div className="h-[430px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis type="number" dataKey="readiness" name="Readiness" unit="%" stroke="#94a3b8" />
          <YAxis type="number" dataKey="impact" name="Impacto" unit="%" stroke="#94a3b8" />
          <ZAxis range={[120, 520]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
          <Scatter name="Tendencias" data={data} fill="#67e8f9" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
