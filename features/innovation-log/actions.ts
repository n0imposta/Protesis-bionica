"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const logSchema = z.object({
  projectId: z.string().uuid(),
  type: z.enum(["note", "photo", "video", "pdf", "audio", "sketch", "decision", "problem", "prototype_version", "clinical_observation"]),
  title: z.string().min(3),
  body: z.string().optional(),
  tags: z.string().optional(),
  prototypeVersion: z.string().optional(),
});

export async function createLogEntryAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar bitacoras reales." };
  const parsed = logSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Debes iniciar sesion." };

  const { error } = await supabase.from("innovation_log_entries").insert({
    project_id: parsed.data.projectId,
    author_id: userData.user.id,
    type: parsed.data.type,
    title: parsed.data.title,
    body: parsed.data.body || null,
    tags: parsed.data.tags?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    prototype_version: parsed.data.prototypeVersion || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/innovation-log");
  revalidatePath("/dashboard");
  return { success: "Entrada de bitacora creada." };
}
