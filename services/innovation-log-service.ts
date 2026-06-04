import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getInnovationLogEntries() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("innovation_log_entries")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}