import { RoadmapView } from "@/features/roadmap/roadmap-view";
import { getProjects } from "@/services/projects-service";
import { getRoadmapMilestones } from "@/services/roadmap-service";

export default async function RoadmapPage() {
  const [milestones, projects] = await Promise.all([getRoadmapMilestones(), getProjects()]);
  return <RoadmapView milestones={milestones} projects={projects} />;
}
