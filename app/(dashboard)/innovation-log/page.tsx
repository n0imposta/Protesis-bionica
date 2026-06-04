import { InnovationLogView } from "@/features/innovation-log/innovation-log-view";
import { getInnovationLogEntries } from "@/services/innovation-log-service";
import { getProjects } from "@/services/projects-service";

export default async function InnovationLogPage() {
  const [entries, projects] = await Promise.all([getInnovationLogEntries(), getProjects()]);
  return <InnovationLogView entries={entries} projects={projects} />;
}
