"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTrendAction } from "./actions";

export function CreateTrendForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createTrendAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <select name="projectId" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70">
        <option value="">Global</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select>
      <Input name="name" placeholder="Nombre de tendencia" required />
      <Input name="category" placeholder="Categoria" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="impact" type="number" min="0" max="100" placeholder="Impacto 0-100" required />
        <Input name="readiness" type="number" min="0" max="100" placeholder="Readiness 0-100" required />
      </div>
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">{pending ? "Guardando..." : "Guardar tendencia"}</Button>
    </form>
  );
}
