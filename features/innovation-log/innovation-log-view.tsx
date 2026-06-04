import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Camera, FileArchive, Mic, Video } from "lucide-react";
import { CreateLogEntryForm } from "./create-log-entry-form";

const icons = { photo: Camera, video: Video, audio: Mic, pdf: FileArchive, note: FileArchive, sketch: Camera, decision: FileArchive, problem: FileArchive, prototype_version: FileArchive, clinical_observation: Camera };

type LogEntry = { id: string; title: string; type: keyof typeof icons; tags: string[] | null; prototype_version: string | null };

export function InnovationLogView({ entries, projects }: { entries: LogEntry[]; projects: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <PageHeader
        eyebrow="Bitacora de innovacion"
        title="Timeline de evidencia, decisiones y prototipos"
        description="Registra notas, fotos, videos, PDFs, audios, sketches, problemas, versiones y observaciones clinicas con trazabilidad."
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardTitle>Nueva entrada</CardTitle>
          <CardDescription>Guarda evidencia real asociada a un proyecto.</CardDescription>
          <div className="mt-4"><CreateLogEntryForm projects={projects} /></div>
        </Card>
        <Card>
          {entries.length === 0 && <EmptyState title="Bitacora vacia" description="Crea entradas para decisiones, problemas, versiones y observaciones clinicas." />}
          <div className="relative space-y-5 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10">
          {entries.map((entry) => (
            <div key={entry.title} className="relative flex gap-4">
              <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-cyan-300/30 bg-cyan-300/10">
                {(() => {
                  const Icon = icons[entry.type] ?? FileArchive;
                  return <Icon className="h-4 w-4 text-cyan-200" />;
                })()}
              </div>
              <div className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription>{entry.type} / Prototipo {entry.prototype_version ?? "sin version"}</CardDescription>
                  </div>
                  <Badge tone="violet">Versionado</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(entry.tags ?? []).map((tag) => <Badge key={tag}>{tag}</Badge>)}
                </div>
              </div>
            </div>
          ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
