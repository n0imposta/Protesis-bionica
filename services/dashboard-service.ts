import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { DashboardOverview } from "@/types/domain";

export async function getDashboardStats(): Promise<DashboardOverview> {
  if (!isSupabaseConfigured) {
    // Return empty structure matching DashboardOverview type
    return {
      projectCount: 0,
      insightCount: 0,
      paperCount: 0,
      prototypeCount: 0,
      recentProjects: [],
      recentActivity: [],
      recentPapers: [],
      recentMilestones: []
    };
  }

  const supabase = await createClient();
  
  try {
    // Get counts
    const [
      projectsResult,
      insightsResult,
      papersResult,
      prototypesResult,
      recentProjectsResult,
      recentActivityResult,
      recentPapersResult,
      recentMilestonesResult
    ] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact" }),
      supabase.from("innovation_log_entries").select("id", { count: "exact" }),
      supabase.from("research_papers").select("id", { count: "exact" }),
      supabase.from("innovation_log_entries").select("id", { count: "exact" }).filter("type", "eq", "prototype_version"),
      supabase.from("projects").select("id,name,status,progress,owner_id").order("updated_at", { ascending: false }).limit(5),
      supabase.from("innovation_log_entries").select("title").order("created_at", { ascending: false }).limit(10),
      supabase.from("research_papers").select("id,title,category,doi").order("created_at", { ascending: false }).limit(5),
      supabase.from("roadmap_milestones").select("id,title,domain,milestone_year").order("milestone_year", { ascending: true }).limit(5)
    ]);

    // Process recent projects
    const recentProjects = (recentProjectsResult.data || []).map((project: any) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      progress: project.progress,
      owner: project.owner_id || null
    }));

    // Process recent activity (simplified - just taking titles from innovation log)
    const recentActivity = (recentActivityResult.data || []).map((item: any) => item.title || "Actualización del sistema");

    // Process recent papers
    const recentPapers = (recentPapersResult.data || []).map((paper: any) => ({
      id: paper.id,
      title: paper.title,
      category: paper.category,
      doi: paper.doi || null
    }));

    // Process recent milestones
    const recentMilestones = (recentMilestonesResult.data || []).map((milestone: any) => ({
      id: milestone.id,
      title: milestone.title,
      domain: milestone.domain,
      milestone_year: milestone.milestone_year
    }));

    return {
      projectCount: projectsResult.count ?? 0,
      insightCount: insightsResult.count ?? 0,
      paperCount: papersResult.count ?? 0,
      prototypeCount: prototypesResult.count ?? 0,
      recentProjects,
      recentActivity,
      recentPapers,
      recentMilestones
    };
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    // Return empty structure on error
    return {
      projectCount: 0,
      insightCount: 0,
      paperCount: 0,
      prototypeCount: 0,
      recentProjects: [],
      recentActivity: [],
      recentPapers: [],
      recentMilestones: []
    };
  }
}