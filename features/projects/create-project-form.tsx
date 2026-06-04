"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createProjectAction } from "./actions";
import { Plus } from "lucide-react";

export function CreateProjectForm() {
  const [state, action, pending] = useActionState(createProjectAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <Input name="name" placeholder="Nombre del proyecto" required />
      <Textarea name="objectives" placeholder="Objetivos, uno por linea" />
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        <Plus className="h-4 w-4" /> {pending ? "Guardando..." : "Crear proyecto"}
      </Button>
    </form>
  );
}
