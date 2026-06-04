"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const observationSchema = z.object({
  projectId: z.string().uuid(),
  activity: z.string().min(2),
  environment: z.string().optional(),
  objectsUsed: z.string().optional(),
  interactions: z.string().optional(),
  observations: z.string().optional(),
});

function list(value?: string) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

export async function createObservationAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar observaciones." };
  const parsed = observationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("contextual_observations").insert({
    project_id: parsed.data.projectId,
    activity: parsed.data.activity,
    environment: parsed.data.environment || null,
    objects_used: list(parsed.data.objectsUsed),
    interactions: list(parsed.data.interactions),
    observations: parsed.data.observations || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/contextual-observation");
  return { success: "Observacion guardada." };
}
