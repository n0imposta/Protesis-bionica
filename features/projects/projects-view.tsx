import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { FileText, UsersRound } from "lucide-react";
import { CreateProjectForm } from "./create-project-form";

type ProjectRow = {
  id: string;
  name: string;
  status: string;
  progress: number;
  objectives: string[] | null;
};

export function ProjectsView({ projects }: { projects: ProjectRow[] }) {
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio de innovacion"
        title="Sistema de proyectos"
        description="Gestiona objetivos, integrantes, documentacion, timeline, archivos y metricas por proyecto."
      />
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><div><CardTitle>Nuevo proyecto</CardTitle><CardDescription>Se guarda en PostgreSQL y queda asociado a tu usuario.</CardDescription></div></CardHeader>
          <CreateProjectForm />
        </Card>
        <div className="grid gap-5 lg:grid-cols-2">
        {projects.length === 0 && (
          <EmptyState title="Todavia no hay proyectos" description="Crea el primer proyecto para empezar a cargar entrevistas, papers, pacientes y bitacoras." />
        )}
        {projects.map((project) => (
          <Card key={project.name}>
            <CardHeader>
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.status.replaceAll("_", " ")}</CardDescription>
              </div>
              <Badge tone="mint">{project.progress}%</Badge>
            </CardHeader>
            <Progress value={project.progress} />
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-white/[0.05] p-3 text-slate-300"><UsersRound className="mb-2 h-4 w-4 text-cyan-200" /> 8 integrantes</div>
              <div className="rounded-md bg-white/[0.05] p-3 text-slate-300"><FileText className="mb-2 h-4 w-4 text-cyan-200" /> 34 archivos</div>
            </div>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
