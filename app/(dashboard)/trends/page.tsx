import { TrendsView } from "@/features/trends/trends-view";
import { getProjects } from "@/services/projects-service";
import { getTrends } from "@/services/trends-service";

export default async function TrendsPage() {
  const [trends, projects] = await Promise.all([getTrends(), getProjects()]);
  return <TrendsView trends={trends} projects={projects} />;
}
