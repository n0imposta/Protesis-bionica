"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { runResearchAgentAction } from "./actions";
import { Bot, Search, Sparkles } from "lucide-react";
import type { IntelligenceResult } from "@/types/domain";

export function AiAgentsView() {
  const [state, action, pending] = useActionState(runResearchAgentAction, undefined);

  return (
    <div>
      <PageHeader
        eyebrow="Agentes de inteligencia"
        title="Investigacion automatizada y analisis IA"
        description="Busca papers, ensayos clinicos y metadata abierta; luego sintetiza oportunidades, riesgos y acciones para el proyecto."
      />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <div><CardTitle>Research Intelligence Agent</CardTitle><CardDescription>Fuentes: OpenAlex, Europe PMC, Crossref y ClinicalTrials.gov.</CardDescription></div>
            <Bot className="h-5 w-5 text-cyan-200" />
          </CardHeader>
          <form action={action} className="space-y-3">
            <Input name="query" defaultValue="low cost myoelectric prosthetic hand haptic feedback" placeholder="Tema a investigar" />
            {state?.error && <p className="text-sm text-rose-200">{state.error}</p>}
            <Button disabled={pending} className="w-full">
              <Search className="h-4 w-4" /> {pending ? "Analizando fuentes..." : "Ejecutar agente"}
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div><CardTitle>Analisis IA</CardTitle><CardDescription>Proveedor activo: {state?.provider ?? "pendiente"}</CardDescription></div>
              <Sparkles className="h-5 w-5 text-violet-200" />
            </CardHeader>
            <div className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {state?.analysis ?? "Ejecuta el agente para generar un analisis. Si no hay API configurada, veras fuentes sin sintesis LLM."}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {(state?.results ?? []).map((item: IntelligenceResult) => (
              <Card key={`${item.source}-${item.url}`}>
                <Badge tone="cyan">{item.source}</Badge>
                <h3 className="mt-3 text-sm font-semibold leading-6 text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-400">{item.summary || "Sin resumen disponible."}</p>
                <a className="mt-3 inline-flex text-sm text-cyan-200 hover:text-cyan-100" href={item.url} target="_blank" rel="noreferrer">Abrir fuente</a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
