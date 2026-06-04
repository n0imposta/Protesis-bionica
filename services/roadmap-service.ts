import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getRoadmapMilestones() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("roadmap_milestones")
    .select("id,title,domain,milestone_year,maturity,status")
    .order("milestone_year", { ascending: true });
  return data ?? [];
}