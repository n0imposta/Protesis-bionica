import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getEmpathyNotes() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("empathy_notes")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}