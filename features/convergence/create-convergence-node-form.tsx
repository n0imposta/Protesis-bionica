"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createConvergenceNodeAction } from "./actions";

export function CreateConvergenceNodeForm({ projects }: { projects: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createConvergenceNodeAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="border rounded-lg p-4 bg-white/5">
        <div className="mb-4">
          <Input
            name="label"
            placeholder="Nombre del nodo (ej. Sensores hápticos de bajo costo)"
            required
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Dominio Principal</label>
            <select
              name="primaryDomain"
              className="w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">Seleccionar dominio...</option>
              <option value="healthcare">Healthcare</option>
              <option value="tech">Tech</option>
              <option value="consumerCulture">Consumers/Culture</option>
              <option value="environment">Environment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-300 mb-1">Dominios Secundarios (máx. 3)</label>
            <div className="flex flex-wrap gap-1">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="secondaryDomains[]"
                  value="healthcare"
                  className="h-4 w-4 text-cyan-600 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-xs">Healthcare</span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="secondaryDomains[]"
                  value="tech"
                  className="h-4 w-4 text-cyan-600 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-xs">Tech</span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="secondaryDomains[]"
                  value="consumerCulture"
                  className="h-4 w-4 text-cyan-600 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-xs">Consumers/Culture</span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="secondaryDomains[]"
                  value="environment"
                  className="h-4 w-4 text-cyan-600 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-xs">Environment</span>
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Máximo 3 dominios secundarios
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <label className="block text-xs text-gray-300 mb-1">Descripción (opcional)</label>
          <Textarea
            name="description"
            placeholder="Describe brevemente este nodo de convergencia..."
            rows={3}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Impacto (X) 0-100</label>
            <Input
              name="x"
              type="number"
              min="0"
              max="100"
              placeholder="Ej. 75"
              required
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Factibilidad (Y) 0-100</label>
            <Input
              name="y"
              type="number"
              min="0"
              max="100"
              placeholder="Ej. 60"
              required
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="mb-3">
            <label className="block text-xs text-gray-300 mb-1">Validación según Etapas de Vijay Kumar</label>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Etapa 3: Deseabilidad (Usuario)</label>
              <Textarea
                name="validationDesirability"
                placeholder="¿Este nodo resuelve una necesidad real y significativa de los usuarios? Considere: aceptación, deseo de uso, ajuste al contexto de vida."
                rows={3}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-300 mb-1">Etapa 2: Factibilidad (Técnico)</label>
              <Textarea
                name="validationFeasibility"
                placeholder="¿Podemos construir esto con las tecnologías, habilidades y recursos disponibles? Considere: limitaciones técnicas, disponibilidad de materiales, complejidad."
                rows={3}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-300 mb-1">Etapa 1+2: Viabilidad (Propósito+Contexto)</label>
              <Textarea
                name="validationViability"
                placeholder="¿Este nodo encaja en nuestro propósito y tiene un camino sostenible? Considere: costos, mantenimiento, impacto ambiental, escalabilidad."
                rows={3}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex w-between items-start mb-2">
            <label className="block text-xs text-gray-300 mb-1">Estado Inicial</label>
            <select
              name="status"
              className="w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="underReview">En Revisión</option>
              <option value="approvedForPrototyping">Aprobado para Prototipado</option>
              <option value="discarded">Descartado</option>
              <option value="inPrototyping">En Prototipado</option>
              <option value="validated">Validado</option>
            </select>
          </div>
          
          <div className="flex items-start gap-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="projectId"
                value=""
                className="h-4 w-4 text-cyan-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-xs">Nodo Global (no asociado a proyecto específico)</span>
            </label>
          </div>
        </div>
      </div>
      
      {state?.error && (
        <p className="text-sm text-rose-200">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-200">
          {state.success}
        </p>
      )}
      
      <Button
        type="submit"
        disabled={pending}
        className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-14.736-3m14.736 3a17.978 17.978 0 01-4.316 11m7.42 4.12a60.608 60.608 0 00-.338 8.975v.1a64.806 64.806 0 0011.702 13.08h1.706c6.631 0 12.018-4.018 12.018-9V14a7.989 7.989 0 00-3.083-7.038z"></path></svg>
            Guardando...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Crear Nodo de Convergencia
          </>
        )}
      </Button>
    </form>
  );
}