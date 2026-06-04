"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const patientSchema = z.object({
  projectId: z.string().uuid().optional().or(z.literal("")),
  code: z.string().min(2),
  age: z.coerce.number().int().min(0).max(120),
  amputationType: z.string().min(2),
  socialContext: z.string().optional(),
  needs: z.string().optional(),
  limitations: z.string().optional(),
  goals: z.string().optional(),
  activities: z.string().optional(),
  clinicalNotes: z.string().optional(),
});

function list(value?: string) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

export async function createPatientAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar perfiles clinicos." };
  const parsed = patientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("patient_profiles").insert({
    project_id: parsed.data.projectId || null,
    code: parsed.data.code,
    age: parsed.data.age,
    amputation_type: parsed.data.amputationType,
    social_context: parsed.data.socialContext || null,
    needs: list(parsed.data.needs),
    limitations: list(parsed.data.limitations),
    goals: list(parsed.data.goals),
    activities: list(parsed.data.activities),
    clinical_notes: parsed.data.clinicalNotes || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/patients");
  return { success: "Perfil de paciente creado." };
}
