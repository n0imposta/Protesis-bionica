"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createObservationAction } from "./actions";

export function CreateObservationForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createObservationAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <select name="projectId" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" required>
        <option value="">Selecciona proyecto</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select>
      <Input name="activity" placeholder="Actividad observada" required />
      <Input name="environment" placeholder="Entorno" />
      <Input name="objectsUsed" placeholder="Objetos usados, separados por coma" />
      <Input name="interactions" placeholder="Interacciones, separadas por coma" />
      <Textarea name="observations" placeholder="Observaciones" />
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Guardando..." : "Guardar observacion"}</Button>
    </form>
  );
}
