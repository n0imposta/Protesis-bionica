"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const competitorSchema = z.object({
  company: z.string().min(2),
  product: z.string().min(2),
  priceRange: z.string().optional(),
  technology: z.string().optional(),
  accessibility: z.coerce.number().int().min(0).max(100),
  sensors: z.string().optional(),
  aiCapability: z.string().optional(),
  personalization: z.string().optional(),
  materials: z.string().optional(),
});

export async function createCompetitorAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar competidores." };
  const parsed = competitorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("competitors").insert({
    company: parsed.data.company,
    product: parsed.data.product,
    price_range: parsed.data.priceRange || null,
    technology: parsed.data.technology || null,
    accessibility: parsed.data.accessibility,
    materials: parsed.data.materials?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    sensors: parsed.data.sensors || null,
    ai_capability: parsed.data.aiCapability || null,
    personalization: parsed.data.personalization || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/competitors");
  return { success: "Competidor guardado." };
}
