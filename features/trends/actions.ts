"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const trendSchema = z.object({
  projectId: z.string().uuid().optional().or(z.literal("")),
  name: z.string().min(2),
  category: z.string().min(2),
  impact: z.coerce.number().int().min(0).max(100),
  readiness: z.coerce.number().int().min(0).max(100),
});

export async function createTrendAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar tendencias." };
  const parsed = trendSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("technology_trends").insert({
    project_id: parsed.data.projectId || null,
    name: parsed.data.name,
    category: parsed.data.category,
    impact: parsed.data.impact,
    readiness: parsed.data.readiness,
  });

  if (error) return { error: error.message };
  revalidatePath("/trends");
  return { success: "Tendencia guardada." };
}
