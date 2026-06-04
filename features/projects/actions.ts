"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const projectSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  objectives: z.string().optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProjectAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar proyectos reales." };

  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Debes iniciar sesion." };

  const objectives = parsed.data.objectives
    ?.split("\n")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: parsed.data.name,
      slug: `${slugify(parsed.data.name)}-${Date.now().toString(36)}`,
      objectives,
      owner_id: userData.user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "No se pudo crear el proyecto." };

  await supabase.from("project_members").insert({
    project_id: data.id,
    user_id: userData.user.id,
    role: "admin",
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { success: "Proyecto creado." };
}
