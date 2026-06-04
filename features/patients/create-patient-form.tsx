"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createPatientAction } from "./actions";
import { Plus } from "lucide-react";

export function CreatePatientForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createPatientAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <select name="projectId" className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70">
        <option value="">Sin proyecto asociado</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="code" placeholder="Codigo paciente, ej. P-018" required />
        <Input name="age" type="number" min="0" max="120" placeholder="Edad" required />
      </div>
      <Input name="amputationType" placeholder="Tipo de amputacion" required />
      <Input name="socialContext" placeholder="Contexto social" />
      <Input name="needs" placeholder="Necesidades separadas por coma" />
      <Input name="limitations" placeholder="Limitaciones separadas por coma" />
      <Input name="goals" placeholder="Objetivos separados por coma" />
      <Input name="activities" placeholder="Actividades separadas por coma" />
      <Textarea name="clinicalNotes" placeholder="Observaciones clinicas" />
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        <Plus className="h-4 w-4" /> {pending ? "Guardando..." : "Guardar paciente"}
      </Button>
    </form>
  );
}
