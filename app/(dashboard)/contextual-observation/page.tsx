import { ContextualObservationView } from "@/features/contextual-observation/contextual-observation-view";
import { getContextualObservations } from "@/services/contextual-observation-service";
import { getProjects } from "@/services/projects-service";

export default async function ContextualObservationPage() {
  const [observations, projects] = await Promise.all([getContextualObservations(), getProjects()]);
  return <ContextualObservationView observations={observations} projects={projects} />;
}
