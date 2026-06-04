"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createPaperAction } from "./actions";
import { Upload } from "lucide-react";

export function CreatePaperForm() {
  const [state, action, pending] = useActionState(createPaperAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <Input name="title" placeholder="Titulo del paper" required />
      <Input name="doi" placeholder="DOI" />
      <Input name="category" placeholder="Categoria: EMG, Robotica, Sensores..." required />
      <Input name="keywords" placeholder="Keywords separadas por coma" />
      <Textarea name="abstract" placeholder="Resumen tecnico" />
      {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        <Upload className="h-4 w-4" /> {pending ? "Guardando..." : "Guardar paper"}
      </Button>
    </form>
  );
}
