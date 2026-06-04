import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Camera, Video } from "lucide-react";
import { CreateObservationForm } from "./create-observation-form";

type ObservationRow = { id: string; activity: string; environment: string | null; objects_used: string[] | null; interactions: string[] | null; observations: string | null };

export function ContextualObservationView({ observations, projects }: { observations: ObservationRow[]; projects: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <PageHeader
        eyebrow="Observacion contextual"
        title="Entorno, actividades, objetos e interacciones"
        description="Registra videos, fotos, actividades, objetos utilizados y observaciones para descubrir requisitos reales."
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><div><CardTitle>Nueva observacion</CardTitle><CardDescription>Datos de campo para descubrir requisitos reales.</CardDescription></div></CardHeader>
          <CreateObservationForm projects={projects} />
        </Card>
        <div className="grid gap-5 md:grid-cols-2">
        {observations.length === 0 && <EmptyState title="Sin observaciones" description="Carga actividades y contexto para alimentar investigacion de usuario." />}
        {observations.map((observation, index) => (
          <Card key={observation.id}>
            <CardHeader>
              <div><CardTitle>{observation.activity}</CardTitle><CardDescription>{observation.environment ?? `Sesion OC-${String(index + 1).padStart(3, "0")}`}</CardDescription></div>
              {index % 2 ? <Video className="h-5 w-5 text-cyan-200" /> : <Camera className="h-5 w-5 text-cyan-200" />}
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              {(observation.objects_used ?? []).map((item) => <Badge key={item}>{item}</Badge>)}
              {(observation.interactions ?? []).map((item) => <Badge key={item}>{item}</Badge>)}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{observation.observations ?? "Sin notas"}</p>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
