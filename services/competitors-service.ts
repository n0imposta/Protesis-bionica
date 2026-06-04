import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getCompetitors() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("competitors")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}