"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMilestoneAction } from "./actions";

export function CreateMilestoneForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createMilestoneAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <select name="projectId" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" required>
        <option value="">Selecciona proyecto</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select>
      <Input name="title" placeholder="Titulo del hito" required />
      <Input name="domain" placeholder="Dominio tecnologico" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="milestoneYear" type="number" min="1900" max="2100" placeholder="Año" required />
        <Input name="maturity" type="number" min="0" max="100" placeholder="Madurez 0-100" required />
      </div>
      <select name="status" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70" defaultValue="active">
        <option value="historical">Historico</option>
        <option value="active">Actual</option>
        <option value="forecast">Proyeccion</option>
      </select>
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Guardando..." : "Guardar hito"}</Button>
    </form>
  );
}
