import { ProjectsView } from "@/features/projects/projects-view";
import { getProjects } from "@/services/projects-service";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsView projects={projects} />;
}
