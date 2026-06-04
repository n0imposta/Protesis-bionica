"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().min(2),
  career: z.string().min(2),
});

export async function updateProfileAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para actualizar perfiles." };
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Nombre y carrera son obligatorios." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Debes iniciar sesion." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, career: parsed.data.career, updated_at: new Date().toISOString() })
    .eq("id", userData.user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { success: "Perfil actualizado." };
}
