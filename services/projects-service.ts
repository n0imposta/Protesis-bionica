import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getProjects() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id,name,status,progress,objectives,updated_at")
    .order("updated_at", { ascending: false });
  return data ?? [];
}