"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";
import { useState, useMemo } from "react";
import { getConvergenceQuadrant, calculateConvergenceScore } from "@/services/convergence-service";

type ConvergenceNode = {
  id: string;
  label: string;
  primaryDomain: 'healthcare' | 'tech' | 'consumerCulture' | 'environment';
  secondaryDomains: ('healthcare' | 'tech' | 'consumerCulture' | 'environment')[];
  x: number;
  y: number;
  status: 'underReview' | 'approvedForPrototyping' | 'discarded' | 'inPrototyping' | 'validated';
  validationDesirability: string | null;
  validationFeasibility: string | null;
  validationViability: string | null;
};

type ConvergenceFiltersProps = {
  nodes: ConvergenceNode[];
  onFilterChange: (filteredNodes: ConvergenceNode[]) => void;
};

export function ConvergenceFilters({ nodes, onFilterChange }: ConvergenceFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<('healthcare' | 'tech' | 'consumerCulture' | 'environment')[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<('underReview' | 'approvedForPrototyping' | 'discarded' | 'inPrototyping' | 'validated')[]>([]);
  const [validationFilters, setValidationFilters] = useState<{
    desirability: boolean;
    feasibility: boolean;
    viability: boolean;
  }>({ desirability: false, feasibility: false, viability: false });
  const [minConvergenceScore, setMinConvergenceScore] = useState(0);

  // Filter nodes based on current filter state
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      // Search filter
      if (searchTerm.trim() !== "") {
        const searchableText = `${node.label} ${node.primaryDomain} ${node.secondaryDomains.join(" ")}`.toLowerCase();
        if (!searchableText.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Domain filter
      if (selectedDomains.length > 0) {
        const hasPrimaryMatch = selectedDomains.includes(node.primaryDomain);
        const hasSecondaryMatch = node.secondaryDomains.some((domain) => selectedDomains.includes(domain));
        if (!hasPrimaryMatch && !hasSecondaryMatch) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus.length > 0 && !selectedStatus.includes(node.status)) {
        return false;
      }

      // Validation filters
      if (validationFilters.desirability && !node.validationDesirability) {
        return false;
      }
      if (validationFilters.feasibility && !node.validationFeasibility) {
        return false;
      }
      if (validationFilters.viability && !node.validationViability) {
        return false;
      }

      // Convergence score filter
      const score = calculateConvergenceScore(node);
      if (score < minConvergenceScore) {
        return false;
      }

      return true;
    });
  }, [nodes, searchTerm, selectedDomains, selectedStatus, validationFilters, minConvergenceScore]);

  // Update filtered nodes when filters change
  // Note: We're using useEffect to call onFilterChange when filteredNodes changes
  useEffect(() => {
    onFilterChange(filteredNodes);
  }, [filteredNodes, onFilterChange]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-white/5">
        <div className="flex w-between items-start mb-3">
          <h4 className="font-medium text-white">Filtros de Convergencia</h4>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedDomains([]);
              setSelectedStatus([]);
              setValidationFilters({ desirability: false, feasibility: false, viability: false });
              setMinConvergenceScore(0);
              // onFilterChange will be called via useEffect
            }}
            className="text-xs text-gray-400 hover:text-white"
          >
            Limpiar
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-3">
          <label className="block text-xs text-gray-300 mb-1">Buscar por nombre o dominio</label>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej. sensores, hapticos, impresión..."
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        {/* Domain Filters */}
        <div className="mb-3">
          <div className="flex w-between items-start mb-1">
            <h5 className="font-medium text-sm text-white">Dominios</h5>
          </div>
          <div className="grid gap-2 text-xs">
            <label className="flex items-start">
              <Checkbox
                checked={selectedDomains.includes("healthcare")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedDomains, "healthcare"] 
                    : selectedDomains.filter((d) => d !== "healthcare");
                  setSelectedDomains(newList);
                }}
              />
              <span className="ml-2 w-full">Healthcare (Amputaciones, kinesiología, costos)</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={selectedDomains.includes("tech")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedDomains, "tech"] 
                    : selectedDomains.filter((d) => d !== "tech");
                  setSelectedDomains(newList);
                }}
              />
              <span className="ml-2 w-full">Tech (Impresión 3D/4D, robótica, sensores EMG)</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={selectedDomains.includes("consumerCulture")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedDomains, "consumerCulture"] 
                    : selectedDomains.filter((d) => d !== "consumerCulture");
                  setSelectedDomains(newList);
                }}
              />
              <span className="ml-2 w-full">Consumers/Culture (Familias, comunidad Maker)</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={selectedDomains.includes("environment")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedDomains, "environment"] 
                    : selectedDomains.filter((d) => d !== "environment");
                  setSelectedDomains(newList);
                }}
              />
              <span className="ml-2 w-full">Environment (Residuos, economía circular, materiales)</span>
            </label>
          </div>
        </div>
        
        {/* Status Filters */}
        <div className="mb-3">
          <div className="flex w-between items-start mb-1">
            <h5 className="font-medium text-sm text-white">Estado</h5>
          </div>
          <div className="grid gap-1 text-xs">
            <label className="flex items-start">
              <Checkbox
                checked={selectedStatus.includes("underReview")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedStatus, "underReview"] 
                    : selectedStatus.filter((s) => s !== "underReview");
                  setSelectedStatus(newList);
                }}
              />
              <span className="ml-2">En Revisión</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={selectedStatus.includes("approvedForPrototyping")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedStatus, "approvedForPrototyping"] 
                    : selectedStatus.filter((s) => s !== "approvedForPrototyping");
                  setSelectedStatus(newList);
                }}
              />
              <span className="ml-2">Aprobado para Prototipado</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={selectedStatus.includes("discarded")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedStatus, "discarded"] 
                    : selectedStatus.filter((s) => s !== "discarded");
                  setSelectedStatus(newList);
                }}
              />
              <span className="ml-2">Descartado</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={selectedStatus.includes("inPrototyping")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedStatus, "inPrototyping"] 
                    : selectedStatus.filter((s) => s !== "inPrototyping");
                  setSelectedStatus(newList);
                }}
              />
              <span className="ml-2">En Prototipado</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={selectedStatus.includes("validated")}
                onChange={(checked) => {
                  const newList = checked 
                    ? [...selectedStatus, "validated"] 
                    : selectedStatus.filter((s) => s !== "validated");
                  setSelectedStatus(newList);
                }}
              />
              <span className="ml-2">Validado</span>
            </label>
          </div>
        </div>
        
        {/* Validation Filters */}
        <div className="mb-3">
          <div className="flex w-between items-start mb-1">
            <h5 className="font-medium text-sm text-white">Validaciones (Etapas 1-3)</h5>
          </div>
          <div className="grid gap-2 text-xs">
            <label className="flex items-start">
              <Checkbox
                checked={validationFilters.desirability}
                onChange={(checked) => {
                  setValidationFilters(prev => ({ ...prev, desirability: checked }));
                }}
              />
              <span className="ml-2 w-full">Etapa 3: Deseabilidad (Usuario)</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={validationFilters.feasibility}
                onChange={(checked) => {
                  setValidationFilters(prev => ({ ...prev, feasibility: checked }));
                }}
              />
              <span className="ml-2 w-full">Etapa 2: Factibilidad (Técnico)</span>
            </label>
            <label className="flex items-start">
              <Checkbox
                checked={validationFilters.viability}
                onChange={(checked) => {
                  setValidationFilters(prev => ({ ...prev, viability: checked }));
                }}
              />
              <span className="ml-2 w-full">Etapa 1+2: Viabilidad (Propósito+Contexto)</span>
            </label>
          </div>
        </div>
        
        {/* Convergence Score Filter */}
        <div className="mb-3">
          <div className="flex w-between items-start mb-1">
            <h5 className="font-medium text-sm text-white">Puntuación Mínima de Convergencia</h5>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={minConvergenceScore}
                onChange={(e) => setMinConvergenceScore(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
            <span className="w-16 text-right">{minConvergenceScore}%</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Filtrar nodos con puntuación de convergencia &gt;= {minConvergenceScore}%
          </p>
        </div>
        
        {/* Results Summary */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex w-between items-center text-xs">
            <span className="text-gray-400">
              {filteredNodes.length} de {nodes.length} nodos mostrados
            </span>
            {filteredNodes.length === 0 && nodes.length > 0 && (
              <span className="text-xs text-red-400">¡Ningún nodo coincide con los filtros!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}