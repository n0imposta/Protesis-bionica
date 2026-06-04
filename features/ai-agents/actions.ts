"use server";

import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { analyzeWithAi } from "@/services/ai-provider-service";
import { runMultiSourceSearch } from "@/services/external-intelligence-service";
import type { IntelligenceResult } from "@/types/domain";

const scanSchema = z.object({
  query: z.string().min(3),
});

export type AgentActionState =
  | {
      error?: string;
      success?: string;
      query?: string;
      provider?: string;
      analysis?: string;
      results?: IntelligenceResult[];
    }
  | undefined;

export async function runResearchAgentAction(_prevState: AgentActionState, formData: FormData): Promise<AgentActionState> {
  const parsed = scanSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Consulta invalida" };

  const results = await runMultiSourceSearch(parsed.data.query);
  const ai = await analyzeWithAi(parsed.data.query, results);

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.from("agent_runs").insert({
        user_id: userData.user.id,
        agent_name: "research-intelligence-agent",
        query: parsed.data.query,
        provider: ai.provider,
        analysis: ai.analysis,
        results,
      });
    }
  }

  return { success: "Analisis completado.", query: parsed.data.query, provider: ai.provider, analysis: ai.analysis, results };
}
