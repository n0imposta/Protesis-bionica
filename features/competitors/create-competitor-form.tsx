"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCompetitorAction } from "./actions";

export function CreateCompetitorForm() {
  const [state, action, pending] = useActionState(createCompetitorAction, undefined);

  return (
    <form action={action} className="grid gap-3 md:grid-cols-2">
      <Input name="company" placeholder="Empresa" required />
      <Input name="product" placeholder="Producto" required />
      <Input name="priceRange" placeholder="Precio" />
      <Input name="technology" placeholder="Tecnologia" />
      <Input name="accessibility" type="number" min="0" max="100" placeholder="Accesibilidad 0-100" required />
      <Input name="sensors" placeholder="Sensores" />
      <Input name="aiCapability" placeholder="IA" />
      <Input name="personalization" placeholder="Personalizacion" />
      <Input name="materials" placeholder="Materiales separados por coma" className="md:col-span-2" />
      {state?.error && <p className="text-sm text-rose-200 md:col-span-2">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-200 md:col-span-2">{state.success}</p>}
      <Button type="submit" disabled={pending} className="md:col-span-2">{pending ? "Guardando..." : "Guardar competidor"}</Button>
    </form>
  );
}
