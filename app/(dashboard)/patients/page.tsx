import { PatientsView } from "@/features/patients/patients-view";
import { getPatients } from "@/services/patients-service";
import { getProjects } from "@/services/projects-service";

export default async function PatientsPage() {
  const [patients, projects] = await Promise.all([getPatients(), getProjects()]);
  return <PatientsView patients={patients} projects={projects} />;
}
