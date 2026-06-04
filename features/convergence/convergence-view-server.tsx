import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConvergenceMap } from "./convergence-map";
import { CreateConvergenceNodeForm } from "./create-convergence-node-form";
import { ConvergenceNodeDetails } from "./convergence-node-details";
import { getConvergenceNodes, ConvergenceNode, getConvergenceQuadrant, calculateConvergenceScore } from "@/services/convergence-service";
import { getProjects } from "@/services/projects-service";

export async function getConvergenceViewData() {
  const [nodes, projects] = await Promise.all([
    getConvergenceNodes(),
    getProjects()
  ]);
  return { nodes, projects };
}

export async function ConvergenceViewServer() {
  const { nodes, projects } = await getConvergenceViewData();
  
  return (
    <div className="p-6">
      <PageHeader
        eyebrow="Mapa de convergencia"
        title="Tecnologia, medicina, IA y rehabilitacion conectadas"
        description="Visualizacion interactiva de nodos, relaciones y conexiones dinamicas entre dominios clave."
      />
      
      {/* Vijay Kumar Framework Explanation */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex w-between items-start">
            <div>
              <CardTitle>Marco de Innovación Abierta (Etapas 1-3 de Vijay Kumar)</CardTitle>
              <CardDescription className="mt-2">
                Este mapa aplica las Etapas 1-3 del modelo de 7 etapas de Vijay Kumar para asegurar que 
                cada nodo evaluado tenga una base sólida en deseabilidad, factibilidad y viabilidad 
                antes de avanzar al prototipado.
              </CardDescription>
            </div>
            <Badge variant="secondary" size="sm">
              Etapas 1-3 Active
            </Badge>
          </div>
        </CardHeader>
        
        <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
          <div>
            <h5 className="font-medium mb-1">Etapa 1: Sentido de Intencionalidad</h5>
            <p className="text-gray-600">¿Por qué estamos haciendo esto? Validamos viabilidad y alineación con el propósito de prótesis biónica de bajo costo.</p>
          </div>
          <div>
            <h5 className="font-medium mb-1">Etapa 2: Conocer el Contexto</h5>
            <p className="text-gray-600">¿Qué es posible? Evaluamos factibilidad técnica, recursos disponibles y limitaciones del entorno.</p>
          </div>
          <div>
            <h5 className="font-medium mb-1">Etapa 3: Conocer a las Personas</h5>
            <p className="text-gray-600">¿Para quién lo hacemos? Validamos deseabilidad mediante feedback de usuarios, familias y comunidad.</p>
          </div>
        </div>
      </Card>
      
      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 md:auto">
          <div className="border rounded-lg p-4 bg-white/5">
            <h4 className="font-medium text-white mb-3">Controles</h4>
            <p className="text-sm text-gray-400">
              Los filtros avanzados estarán disponibles en una futura actualización.
              Actualmente se muestran todos los nodos de convergencia.
            </p>
          </div>
        </div>
        <div className="flex-1 md:auto">
          <CreateConvergenceNodeForm projects={projects.map(p => ({ id: p.id, name: p.name }))} />
        </div>
      </div>
      
      {/* Main Content: Map */}
      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Mapa de Convergencia Interdisciplinaria</CardTitle>
            <CardDescription>
              Posiciona nodos según Impacto (X) y Factibilidad (Y). 
              El color indica el dominio principal, el grosor del borde indica el estado de validación.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="p-4">
          <ConvergenceMap nodes={nodes} onNodeClick={() => {}} onNodeDoubleClick={() => {}} />
        </div>
      </Card>
    </div>
  );
}