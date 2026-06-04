"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const noteSchema = z.object({
  projectId: z.string().uuid(),
  zone: z.enum(["thinks", "feels", "says", "does", "pains", "needs"]),
  content: z.string().min(2),
});

export async function createEmpathyNoteAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar empathy maps." };
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("empathy_notes").insert({
    project_id: parsed.data.projectId,
    zone: parsed.data.zone,
    content: parsed.data.content,
    created_by: userData.user?.id ?? null,
  });

  if (error) return { error: error.message };
  revalidatePath("/empathy-map");
  return { success: "Nota creada." };
}
