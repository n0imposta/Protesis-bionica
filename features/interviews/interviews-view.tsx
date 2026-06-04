import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Upload } from "lucide-react";
import { CreateInterviewForm } from "./create-interview-form";

type InterviewRow = {
  id: string;
  title: string;
  transcript: string | null;
  tags: string[] | null;
  experts: { name: string; type: string; organization: string | null } | null;
};

export function InterviewsView({ interviews, projects }: { interviews: InterviewRow[]; projects: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <PageHeader
        eyebrow="Investigacion cualitativa"
        title="Gestion de entrevistas"
        description="Crea entrevistas, carga audio/video, transcribe respuestas, etiqueta expertos y extrae insights accionables."
        action={<Button><Upload className="h-4 w-4" /> Subir evidencia</Button>}
      />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><div><CardTitle>Nueva entrevista</CardTitle><CardDescription>Guarda experto, transcript, tags y preguntas del proyecto.</CardDescription></div></CardHeader>
          <CreateInterviewForm projects={projects} />
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Entrevistas registradas</CardTitle><CardDescription>Datos reales cargados por el equipo.</CardDescription></div></CardHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {interviews.length === 0 && <EmptyState title="Sin entrevistas" description="Registra entrevistas para que los agentes extraigan insights." />}
            {interviews.map((interview) => (
              <div key={interview.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <Badge tone="cyan">{interview.experts?.type.replaceAll("_", " ") ?? "experto"}</Badge>
                <p className="mt-3 font-medium text-white">{interview.title}</p>
                <p className="mt-1 text-sm text-slate-400">{interview.experts?.name ?? "Sin experto"}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{interview.transcript ?? "Sin transcripcion"}</p>
                <div className="mt-3 flex flex-wrap gap-2">{(interview.tags ?? []).map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
