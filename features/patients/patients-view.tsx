import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CreatePatientForm } from "./create-patient-form";

type PatientRow = {
  id: string;
  code: string;
  age: number | null;
  amputation_type: string;
  social_context: string | null;
  goals: string[] | null;
};

export function PatientsView({ patients, projects }: { patients: PatientRow[]; projects: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <PageHeader
        eyebrow="Perfiles usuario/paciente"
        title="Contexto clinico, social y funcional"
        description="Registra edad, tipo de amputacion, necesidades, limitaciones, objetivos, actividades y observaciones clinicas."
      />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader><div><CardTitle>Nuevo paciente</CardTitle><CardDescription>Datos estructurados para analisis clinico posterior.</CardDescription></div></CardHeader>
          <CreatePatientForm projects={projects} />
        </Card>
        <div className="grid gap-5 lg:grid-cols-2">
        {patients.length === 0 && <EmptyState title="Sin pacientes registrados" description="Carga el primer perfil para empezar a construir estadisticas y empathy maps." />}
        {patients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader><div><CardTitle>{patient.code}</CardTitle><CardDescription>{patient.age} años / {patient.amputation_type}</CardDescription></div><Badge tone="mint">Consentimiento</Badge></CardHeader>
            <p className="text-sm leading-6 text-slate-300"><span className="text-white">Objetivos:</span> {(patient.goals ?? []).join(", ") || "Sin objetivos"}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300"><span className="text-white">Contexto:</span> {patient.social_context ?? "Sin contexto"}</p>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
