import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getInterviews() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("interviews")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}