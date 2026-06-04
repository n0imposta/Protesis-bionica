import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getPatients() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("patient_profiles")
    .select("id,code,age,amputation_type,social_context,needs,limitations,goals,activities,clinical_notes")
    .order("created_at", { ascending: false });
  return data ?? [];
}