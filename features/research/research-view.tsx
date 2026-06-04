import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Bookmark, Search } from "lucide-react";
import { CreatePaperForm } from "./create-paper-form";

const categories = ["EMG", "Protesis mioelectricas", "Robotica", "IA medica", "Rehabilitacion", "Sensores", "Materiales", "Neurociencia"];

type PaperRow = {
  id: string;
  title: string;
  doi: string | null;
  abstract: string | null;
  category: string;
  keywords: string[] | null;
  is_favorite: boolean;
};

export function ResearchView({ papers }: { papers: PaperRow[] }) {
  return (
    <div>
      <PageHeader
        eyebrow="Repositorio cientifico"
        title="Papers, DOI, referencias y evidencia"
        description="Curaduria tematica con resumenes, keywords, favoritos, clasificacion y busqueda avanzada."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.65fr]">
        <Card>
          <CardHeader><div><CardTitle>Biblioteca priorizada</CardTitle><CardDescription>Lecturas relevantes para decisiones tecnicas.</CardDescription></div><Search className="h-5 w-5 text-cyan-200" /></CardHeader>
          <div className="space-y-4">
            {papers.length === 0 && <EmptyState title="No hay papers cargados" description="Guarda el primer paper para que los agentes puedan usarlo en analisis." />}
            {papers.map((paper) => (
              <div key={paper.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><Badge tone="violet">{paper.category}</Badge><h3 className="mt-3 font-medium text-white">{paper.title}</h3></div>
                  <Bookmark className={`h-4 w-4 ${paper.is_favorite ? "text-amber-200" : "text-slate-500"}`} />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{paper.abstract ?? "Sin resumen todavia."}</p>
                <p className="mt-2 font-mono text-xs text-slate-500">{paper.doi}</p>
                <Progress value={paper.keywords?.length ? Math.min(95, 45 + paper.keywords.length * 10) : 35} className="mt-4" />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Cargar paper</CardTitle><CardDescription>Registro manual inicial; luego podemos autocompletar por DOI.</CardDescription></div></CardHeader>
          <CreatePaperForm />
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Categorias</CardTitle><CardDescription>Taxonomia biomédica inicial.</CardDescription></div></CardHeader>
          <div className="flex flex-wrap gap-2">{categories.map((category) => <Badge key={category} tone="cyan">{category}</Badge>)}</div>
        </Card>
      </div>
    </div>
  );
}
