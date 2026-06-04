"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const paperSchema = z.object({
  title: z.string().min(3),
  doi: z.string().optional(),
  category: z.string().min(2),
  abstract: z.string().optional(),
  keywords: z.string().optional(),
});

export async function createPaperAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar papers reales." };
  const parsed = paperSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Debes iniciar sesion." };

  const { error } = await supabase.from("research_papers").insert({
    title: parsed.data.title,
    doi: parsed.data.doi || null,
    category: parsed.data.category,
    abstract: parsed.data.abstract || null,
    keywords: parsed.data.keywords?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
  });

  if (error) return { error: error.message };
  revalidatePath("/research");
  revalidatePath("/dashboard");
  return { success: "Paper guardado." };
}
