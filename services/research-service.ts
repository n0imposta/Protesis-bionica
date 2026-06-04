import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getResearchPapers() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("research_papers")
    .select("id,title,doi,abstract,category,keywords,is_favorite,created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}