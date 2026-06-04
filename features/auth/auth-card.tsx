"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction, registerAction, resetPasswordAction } from "./actions";

type AuthMode = "login" | "register" | "reset";

const actions = {
  login: loginAction,
  register: registerAction,
  reset: resetPasswordAction,
};

export function AuthCard({ mode }: { mode: AuthMode }) {
  const [state, formAction, pending] = useActionState(actions[mode], undefined);
  const isRegister = mode === "register";
  const isReset = mode === "reset";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div>
          <CardTitle>{isRegister ? "Crear cuenta" : isReset ? "Recuperar acceso" : "Iniciar sesion"}</CardTitle>
          <CardDescription>
            {isRegister
              ? "Alta de miembros para equipos clinicos, investigacion e ingenieria."
              : isReset
                ? "Recibe un enlace seguro para restablecer tu clave."
                : "Accede al laboratorio de innovacion biomédica."}
          </CardDescription>
        </div>
      </CardHeader>

      <form action={formAction} className="space-y-4">
        {isRegister && <Input name="fullName" placeholder="Nombre completo" autoComplete="name" required />}
        {isRegister && <Input name="career" placeholder="Carrera o especialidad" required />}
        <Input name="email" type="email" placeholder="Email institucional" autoComplete="email" required />
        {!isReset && <Input name="password" type="password" placeholder="Clave segura" autoComplete={isRegister ? "new-password" : "current-password"} required />}
        {isRegister && (
          <select
            name="role"
            className="h-11 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70"
            defaultValue="researcher"
          >
            <option value="admin">Admin</option>
            <option value="researcher">Researcher</option>
            <option value="engineer">Engineer</option>
            <option value="medical_specialist">Medical Specialist</option>
            <option value="student">Student</option>
          </select>
        )}

        {state?.error && <p className="rounded-md border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{state.error}</p>}
        {state?.success && <p className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{state.success}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Procesando..." : isRegister ? "Crear workspace" : isReset ? "Enviar enlace" : "Entrar"}
        </Button>
      </form>

      <div className="mt-5 flex justify-between text-sm text-slate-400">
        <Link className="hover:text-cyan-200" href="/login">Login</Link>
        <Link className="hover:text-cyan-200" href="/register">Register</Link>
        <Link className="hover:text-cyan-200" href="/reset-password">Reset</Link>
      </div>
    </Card>
  );
}
