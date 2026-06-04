import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateCompetitorForm } from "./create-competitor-form";

type CompetitorRow = {
  id: string;
  company: string;
  product: string;
  price_range: string | null;
  accessibility: number | null;
  sensors: string | null;
  ai_capability: string | null;
};

export function CompetitorsView({ competitors }: { competitors: CompetitorRow[] }) {
  return (
    <div>
      <PageHeader
        eyebrow="Market intelligence"
        title="Mapa de competidores"
        description="Compara empresas, productos, precio, tecnologia, accesibilidad, materiales, sensores, IA y personalizacion."
      />
      <Card>
        <CardHeader><div><CardTitle>Nuevo competidor</CardTitle><CardDescription>Carga empresas y productos reales para inteligencia de mercado.</CardDescription></div></CardHeader>
        <CreateCompetitorForm />
      </Card>
      <Card className="mt-6">
        <CardHeader><div><CardTitle>Comparativo de protesis existentes</CardTitle><CardDescription>Variables criticas para posicionamiento de bajo costo.</CardDescription></div></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-3">Empresa</th><th>Producto</th><th>Precio</th><th>Accesibilidad</th><th>Sensores</th><th>IA</th>
              </tr>
            </thead>
            <tbody>
            {competitors.map((item) => (
                <tr key={item.id} className="border-b border-white/10 last:border-0">
                  <td className="py-4 font-medium text-white">{item.company}</td>
                  <td className="text-slate-300">{item.product}</td>
                  <td className="text-slate-300">{item.price_range ?? "Sin dato"}</td>
                  <td><Badge tone={(item.accessibility ?? 0) > 65 ? "mint" : "amber"}>{item.accessibility ?? 0}%</Badge></td>
                  <td className="text-slate-300">{item.sensors ?? "Sin dato"}</td>
                  <td className="text-slate-300">{item.ai_capability ?? "Sin dato"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {competitors.length === 0 && <EmptyState title="Sin competidores" description="Carga competidores reales o importa hallazgos desde los agentes." />}
        </div>
      </Card>
    </div>
  );
}
