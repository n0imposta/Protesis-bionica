import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmpathyBoard } from "./empathy-board";
import { Download, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CreateEmpathyNoteForm } from "./create-empathy-note-form";

type EmpathyNote = { id: string; zone: string; content: string };

export function EmpathyMapView({ notes, projects }: { notes: EmpathyNote[]; projects: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <PageHeader
        eyebrow="Human-centered design"
        title="Empathy map colaborativo"
        description="Organiza que piensa, siente, dice, hace, dolores y necesidades mediante sticky notes exportables."
        action={<div className="flex gap-2"><Button variant="secondary"><Download className="h-4 w-4" /> Exportar</Button><Button><Plus className="h-4 w-4" /> Nota</Button></div>}
      />
      <Card className="mb-6"><CreateEmpathyNoteForm projects={projects} /></Card>
      <EmpathyBoard notes={notes} />
    </div>
  );
}
