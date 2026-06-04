"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createInterviewAction } from "./actions";

export function CreateInterviewForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createInterviewAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <select name="projectId" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" required>
        <option value="">Selecciona proyecto</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select>
      <Input name="title" placeholder="Titulo de la entrevista" required />
      <Input name="expertName" placeholder="Nombre del experto" required />
      <select name="expertType" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" defaultValue="biomedical_engineer">
        <option value="physician">Medico</option>
        <option value="biomedical_engineer">Ingeniero biomédico</option>
        <option value="amputee_patient">Paciente amputado</option>
        <option value="kinesiologist">Kinesiologo</option>
        <option value="occupational_therapist">Terapeuta ocupacional</option>
        <option value="industrial_designer">Diseñador industrial</option>
      </select>
      <Input name="organization" placeholder="Organizacion o contexto" />
      <Input name="tags" placeholder="Tags separados por coma" />
      <Textarea name="transcript" placeholder="Transcripcion, preguntas y respuestas" />
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Guardando..." : "Guardar entrevista"}</Button>
    </form>
  );
}
