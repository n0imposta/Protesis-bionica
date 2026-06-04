import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendsChart } from "./trends-chart";
import { CreateTrendForm } from "./create-trend-form";

type TrendRow = { id: string; name: string; category: string; impact: number; readiness: number };

export function TrendsView({ trends, projects }: { trends: TrendRow[]; projects: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <PageHeader
        eyebrow="Tech intelligence"
        title="Tendencias tecnologicas"
        description="Analiza impacto, madurez y referencias para IA, bioimpresion, interfaces neuronales, haptica y fabricacion digital."
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><div><CardTitle>Nueva tendencia</CardTitle><CardDescription>Registra impacto y madurez tecnica.</CardDescription></div></CardHeader>
          <CreateTrendForm projects={projects} />
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Matriz impacto vs readiness</CardTitle><CardDescription>Priorizacion para roadmap y apuestas de investigacion.</CardDescription></div></CardHeader>
          {trends.length === 0 ? <EmptyState title="Sin tendencias" description="Carga tendencias o ejecuta agentes para empezar el radar tecnologico." /> : <TrendsChart data={trends} />}
        </Card>
      </div>
    </div>
  );
}
