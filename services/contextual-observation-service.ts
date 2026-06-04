import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getContextualObservations() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("contextual_observations")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}