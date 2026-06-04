import { InterviewsView } from "@/features/interviews/interviews-view";
import { getInterviews } from "@/services/interviews-service";
import { getProjects } from "@/services/projects-service";

export default async function InterviewsPage() {
  const [interviews, projects] = await Promise.all([getInterviews(), getProjects()]);
  return <InterviewsView interviews={interviews} projects={projects} />;
}
