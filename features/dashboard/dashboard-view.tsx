import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowUpRight, CircuitBoard, FlaskConical, ShieldCheck } from "lucide-react";
import { DashboardCharts } from "./dashboard-charts";
import type { DashboardOverview } from "@/types/domain";
import { EmptyState } from "@/components/ui/empty-state";

export function DashboardView({ overview }: { overview: DashboardOverview }) {
  const metrics = [
    { label: "Proyectos activos", value: String(overview.projectCount), delta: "Desde Supabase", tone: "cyan" as const },
    { label: "Insights validados", value: String(overview.insightCount), delta: "Analisis del equipo", tone: "mint" as const },
    { label: "Papers curados", value: String(overview.paperCount), delta: "Repositorio real", tone: "violet" as const },
    { label: "Prototipos", value: String(overview.prototypeCount), delta: "Bitacora versionada", tone: "amber" as const },
  ];
  const chartData = [
    { label: "Proyectos", value: overview.projectCount },
    { label: "Insights", value: overview.insightCount },
    { label: "Papers", value: overview.paperCount },
    { label: "Prototipos", value: overview.prototypeCount },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-white/10 p-6 sm:p-8">
        <div className="absolute inset-0 animated-gradient opacity-60" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge tone="mint">HealthTech command center</Badge>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal text-white md:text-6xl">
              Bionic Prosthetics Innovation Toolkit
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              Plataforma modular para investigacion biomédica, diseño centrado en usuarios, validacion clinica y roadmap tecnologico de protesis bionicas accesibles.
            </p>
          </div>
          <div className="grid min-w-72 grid-cols-3 gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-3 backdrop-blur">
            {["TRL 5", "RLS", "ISO-ready"].map((item) => (
              <div key={item} className="rounded-md bg-white/[0.06] p-3 text-center text-sm font-medium text-white">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="mt-2 text-3xl">{metric.value}</CardTitle>
              </div>
              <ArrowUpRight className="h-4 w-4 text-cyan-200" />
            </CardHeader>
            <Badge tone={metric.tone}>{metric.delta}</Badge>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Indicadores de avance</CardTitle>
              <CardDescription>Madurez tecnica, investigacion y validacion de usuarios.</CardDescription>
            </div>
            <CircuitBoard className="h-5 w-5 text-cyan-200" />
          </CardHeader>
          <DashboardCharts data={chartData} />
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>Eventos del laboratorio de innovacion.</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-cyan-200" />
          </CardHeader>
          <div className="space-y-4">
            {overview.recentActivity.length === 0 && (
              <EmptyState title="Sin actividad registrada" description="Cuando el equipo cargue bitacoras, papers o entrevistas, apareceran aqui." />
            )}
            {overview.recentActivity.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                <p className="text-sm leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Proyectos activos</CardTitle>
              <CardDescription>Estado, responsable y progreso tecnico-clinico.</CardDescription>
            </div>
            <FlaskConical className="h-5 w-5 text-emerald-200" />
          </CardHeader>
          <div className="space-y-5">
            {overview.recentProjects.length === 0 && (
              <EmptyState title="Crea tu primer proyecto" description="Los botones de carga ya guardan informacion real en Supabase cuando configures las variables." />
            )}
            {overview.recentProjects.map((project) => (
              <div key={project.name} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{project.name}</p>
                    <p className="text-sm text-slate-400">{project.status}</p>
                  </div>
                  <Badge tone="mint">Activo</Badge>
                </div>
                <Progress value={project.progress} className="mt-4" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Ultimas investigaciones</CardTitle>
              <CardDescription>Papers y referencias priorizadas.</CardDescription>
            </div>
            <ShieldCheck className="h-5 w-5 text-violet-200" />
          </CardHeader>
          <div className="space-y-4">
            {overview.recentPapers.length === 0 && (
              <EmptyState title="Repositorio vacio" description="Sube papers por DOI, titulo, categoria y resumen para alimentar los agentes." />
            )}
            {overview.recentPapers.map((paper) => (
              <div key={paper.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <Badge tone="violet">{paper.category}</Badge>
                <p className="mt-2 text-sm font-medium leading-5 text-white">{paper.title}</p>
                <p className="mt-1 text-xs text-slate-500">{paper.doi}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Timeline tecnologico</CardTitle>
            <CardDescription>Evolucion historica, tecnologias actuales y proyecciones futuras.</CardDescription>
          </div>
        </CardHeader>
        <div className="grid gap-3 md:grid-cols-5">
          {overview.recentMilestones.length === 0 && (
            <EmptyState title="Roadmap sin hitos" description="Los hitos reales que agregues en Roadmap apareceran aqui." />
          )}
          {overview.recentMilestones.map((phase) => (
            <div key={phase.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="font-mono text-sm text-cyan-200">{phase.milestone_year}</p>
              <p className="mt-2 text-sm font-medium text-white">{phase.title}</p>
              <p className="mt-1 text-xs text-slate-400">{phase.domain}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
