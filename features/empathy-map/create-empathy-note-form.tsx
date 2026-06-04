"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { createEmpathyNoteAction } from "./actions";

export function CreateEmpathyNoteForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createEmpathyNoteAction, undefined);

  return (
    <form action={action} className="grid gap-3 md:grid-cols-[1fr_180px_1fr_auto]">
      <select name="projectId" className="h-11 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" required>
        <option value="">Proyecto</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select>
      <select name="zone" className="h-11 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" defaultValue="thinks">
        <option value="thinks">Piensa</option>
        <option value="feels">Siente</option>
        <option value="says">Dice</option>
        <option value="does">Hace</option>
        <option value="pains">Dolores</option>
        <option value="needs">Necesidades</option>
      </select>
      <Textarea name="content" placeholder="Contenido de la nota" required className="min-h-11" />
      <Button type="submit" disabled={pending}>{pending ? "..." : "Agregar"}</Button>
      {state?.error && <p className="text-sm text-rose-200 md:col-span-4">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200 md:col-span-4">{state.success}</p>}
    </form>
  );
}
