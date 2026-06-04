import { EmpathyMapView } from "@/features/empathy-map/empathy-map-view";
import { getEmpathyNotes } from "@/services/empathy-service";
import { getProjects } from "@/services/projects-service";

export default async function EmpathyMapPage() {
  const [notes, projects] = await Promise.all([getEmpathyNotes(), getProjects()]);
  return <EmpathyMapView notes={notes} projects={projects} />;
}
