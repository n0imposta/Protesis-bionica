import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export async function getCurrentProfile() {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id,full_name,career,role,avatar_url")
    .eq("id", userData.user.id)
    .single();
  return data;
}