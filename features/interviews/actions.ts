"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const interviewSchema = z.object({
  projectId: z.string().uuid(),
  expertName: z.string().min(2),
  expertType: z.enum(["physician", "biomedical_engineer", "amputee_patient", "kinesiologist", "occupational_therapist", "industrial_designer"]),
  organization: z.string().optional(),
  title: z.string().min(3),
  transcript: z.string().optional(),
  tags: z.string().optional(),
});

function list(value?: string) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

export async function createInterviewAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar entrevistas." };
  const parsed = interviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Debes iniciar sesion." };

  const { data: expert, error: expertError } = await supabase
    .from("experts")
    .insert({
      name: parsed.data.expertName,
      type: parsed.data.expertType,
      organization: parsed.data.organization || null,
    })
    .select("id")
    .single();

  if (expertError || !expert) return { error: expertError?.message ?? "No se pudo crear experto." };

  const { error } = await supabase.from("interviews").insert({
    project_id: parsed.data.projectId,
    expert_id: expert.id,
    interviewer_id: userData.user.id,
    title: parsed.data.title,
    transcript: parsed.data.transcript || null,
    tags: list(parsed.data.tags),
  });

  if (error) return { error: error.message };
  revalidatePath("/interviews");
  revalidatePath("/dashboard");
  return { success: "Entrevista guardada." };
}
