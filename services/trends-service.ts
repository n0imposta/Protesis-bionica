import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getTrends() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("technology_trends")
    .select("id,name,category,impact,readiness")
    .order("created_at", { ascending: false });
  return data ?? [];
}