"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const milestoneSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(2),
  domain: z.string().min(2),
  milestoneYear: z.coerce.number().int().min(1900).max(2100),
  maturity: z.coerce.number().int().min(0).max(100),
  status: z.enum(["historical", "active", "forecast"]),
});

export async function createMilestoneAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar roadmap." };
  const parsed = milestoneSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("roadmap_milestones").insert({
    project_id: parsed.data.projectId,
    title: parsed.data.title,
    domain: parsed.data.domain,
    milestone_year: parsed.data.milestoneYear,
    maturity: parsed.data.maturity,
    status: parsed.data.status,
  });

  if (error) return { error: error.message };
  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { success: "Hito guardado." };
}
