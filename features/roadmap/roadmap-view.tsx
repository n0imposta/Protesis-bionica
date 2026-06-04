import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Download, Plus } from "lucide-react";
import { CreateMilestoneForm } from "./create-milestone-form";

type MilestoneRow = { id: string; title: string; domain: string; milestone_year: number; maturity: number; status: "historical" | "active" | "forecast" };

export function RoadmapView({ milestones, projects }: { milestones: MilestoneRow[]; projects: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <PageHeader
        eyebrow="Roadmap tecnologico"
        title="Evolucion historica, presente y futuro"
        description="Añade hitos, filtra tecnologias, visualiza tendencias y exporta el roadmap para comites de innovacion."
        action={<div className="flex gap-2"><Button variant="secondary"><Download className="h-4 w-4" /> Exportar</Button><Button><Plus className="h-4 w-4" /> Hito</Button></div>}
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card><CreateMilestoneForm projects={projects} /></Card>
        <div className="space-y-4">
        {milestones.length === 0 && <EmptyState title="Roadmap vacio" description="Crea hitos reales para visualizar evolucion historica y proyecciones." />}
        {milestones.map((item) => (
          <Card key={item.title} className="grid gap-4 md:grid-cols-[120px_1fr_180px] md:items-center">
            <div><p className="font-mono text-2xl text-cyan-200">{item.milestone_year}</p><Badge tone={item.status === "forecast" ? "violet" : item.status === "active" ? "mint" : "slate"}>{item.status}</Badge></div>
            <div><h2 className="text-lg font-semibold text-white">{item.title}</h2><p className="mt-1 text-sm text-slate-400">{item.domain}</p></div>
            <Progress value={item.maturity} />
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
