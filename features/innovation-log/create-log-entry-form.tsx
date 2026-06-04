"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createLogEntryAction } from "./actions";
import { Plus } from "lucide-react";

export function CreateLogEntryForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createLogEntryAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <select name="projectId" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" required>
        <option value="">Selecciona proyecto</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select>
      <select name="type" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" defaultValue="note">
        <option value="note">Nota</option>
        <option value="decision">Decision</option>
        <option value="problem">Problema</option>
        <option value="prototype_version">Version de prototipo</option>
        <option value="clinical_observation">Observacion clinica</option>
        <option value="photo">Foto</option>
        <option value="video">Video</option>
        <option value="pdf">PDF</option>
        <option value="audio">Audio</option>
        <option value="sketch">Sketch</option>
      </select>
      <Input name="title" placeholder="Titulo" required />
      <Input name="prototypeVersion" placeholder="Version de prototipo, ej. V4.2" />
      <Input name="tags" placeholder="Tags separados por coma" />
      <Textarea name="body" placeholder="Observaciones, decisiones, problemas o notas clinicas" />
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        <Plus className="h-4 w-4" /> {pending ? "Guardando..." : "Guardar entrada"}
      </Button>
    </form>
  );
}
