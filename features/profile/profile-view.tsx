"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateProfileAction } from "./actions";

type Profile = {
  full_name: string;
  career: string;
  role: string;
} | null;

export function ProfileView({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  return (
    <div>
      <PageHeader
        eyebrow="Perfil obligatorio"
        title="Identidad del investigador"
        description="Nombre y carrera son datos obligatorios para trazabilidad en registros clinicos, entrevistas y bitacoras."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <div><CardTitle>Datos personales</CardTitle><CardDescription>Estos datos se usan como autoria dentro del toolkit.</CardDescription></div>
          <Badge tone="cyan">{profile?.role ?? "sin rol"}</Badge>
        </CardHeader>
        <form action={action} className="space-y-3">
          <Input name="fullName" defaultValue={profile?.full_name ?? ""} placeholder="Nombre completo" required />
          <Input name="career" defaultValue={profile?.career ?? ""} placeholder="Carrera o especialidad" required />
          {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
          {state?.success && <p className="text-sm text-emerald-200">{state.success}</p>}
          <Button disabled={pending}>{pending ? "Guardando..." : "Guardar perfil"}</Button>
        </form>
      </Card>
    </div>
  );
}
