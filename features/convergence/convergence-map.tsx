"use client";

import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  BrainCircuit, 
  Zap, 
  Shield, 
  Users, 
  Package,
  CircleHelp
} from "lucide-react";
import { 
  getConvergenceQuadrant, 
  calculateConvergenceScore,
  type ConvergenceNode
} from "@/services/convergence-service";

// Updated node type to match our enhanced service
type EnhancedConvergenceNode = ConvergenceNode;

// Domain to icon and color mapping
const DOMAIN_CONFIG = {
  healthcare: { 
    icon: Zap, 
    color: 'text-red-400', 
    bg: 'bg-red-900/20',
    border: 'border-red-300/30'
  },
  tech: { 
    icon: BrainCircuit, 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-900/20',
    border: 'border-cyan-300/30'
  },
  consumerCulture: { 
    icon: Users, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-300/30'
  },
  environment: { 
    icon: Package, 
    color: 'text-green-400', 
    bg: 'bg-green-900/20',
    border: 'border-green-300/30'
  }
};

// Status to border style mapping
const STATUS_CONFIG = {
  underReview: { 
    border: 'border-yellow-400/50', 
    glow: 'drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]'
  },
  approvedForPrototyping: { 
    border: 'border-green-400/50', 
    glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]'
  },
  discarded: { 
    border: 'border-red-400/50', 
    glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]'
  },
  inPrototyping: { 
    border: 'border-blue-400/50', 
    glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]'
  },
  validated: { 
    border: 'border-purple-400/50', 
    glow: 'drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]'
  }
};

export function ConvergenceMap({ 
  nodes, 
  onNodeClick, 
  onNodeDoubleClick 
}: { 
  nodes: EnhancedConvergenceNode[]; 
  onNodeClick?: (nodeId: string) => void;
  onNodeDoubleClick?: (nodeId: string) => void;
}) {
  if (nodes.length === 0) {
    return <EmptyState title="Sin nodos" description="Crea nodos reales para construir el mapa de convergencia." />;
  }

  // Find the central node (highest convergence score or first node)
  const centerNode = nodes.reduce((prev, current) => {
    const prevScore = calculateConvergenceScore(prev);
    const currentScore = calculateConvergenceScore(current);
    return currentScore > prevScore ? current : prev;
  }, nodes[0]);

  return (
    <div className="relative h-[540px] overflow-hidden rounded-lg border border-white/10 bg-slate-950/50">
      {/* Connection Lines - show relationships based on validation strength */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Draw lines from center to other nodes, with thickness based on validation completeness */}
        {nodes.filter((node) => node.id !== centerNode.id).map((node) => {
          // Calculate validation completeness (0-1)
          const validationScore = 
            ((node.validationDesirability?.length ?? 0) > 0 ? 0.33 : 0) +
            ((node.validationFeasibility?.length ?? 0) > 0 ? 0.33 : 0) +
            ((node.validationViability?.length ?? 0) > 0 ? 0.34 : 0);
          
          const lineOpacity = 0.2 + (validationScore * 0.3); // 0.2 to 0.5 opacity
          const lineWidth = 0.5 + (validationScore * 1.5);   // 0.5 to 2.0 width
          
          return (
            <motion.line
              key={node.id}
              x1={centerNode.x}
              y1={centerNode.y}
              x2={node.x}
              y2={node.y}
              stroke={DOMAIN_CONFIG[node.primaryDomain].color}
              strokeOpacity={lineOpacity}
              strokeWidth={lineWidth}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
          );
        })}
      </svg>
      
      {/* Nodes */}
      {nodes.map((node) => {
        const domainConfig = DOMAIN_CONFIG[node.primaryDomain];
        const statusConfig = STATUS_CONFIG[node.status];
        const convergenceScore = calculateConvergenceScore(node);
        const quadrant = getConvergenceQuadrant(node);
        
        // Determine if this is a high-convergence node (top right quadrant)
        const isHighConvergence = quadrant === "highImpactHighFeasibility";
        
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute w-48 -translate-x-1/2 -translate-y-1/2 rounded-xl p-4 backdrop-blur-lg cursor-pointer transition-all duration-200 
              ${domainConfig.bg} 
              ${statusConfig.border}
              ${isHighConvergence ? 'border-2' : 'border'}
              hover:border-2
              hover:${statusConfig.glow}
            `}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => onNodeClick?.(node.id)}
            onDoubleClick={() => onNodeDoubleClick?.(node.id)}
          >
            {/* Domain Icon */}
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <domainConfig.icon className={domainConfig.color} />
            </div>
            
            {/* Node Label */}
            <h3 className="mb-2 font-semibold text-white text-center truncate">
              {node.label}
            </h3>
            
            {/* Convergence Score Badge */}
            <div className="flex w-between items-center text-xs mb-2">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/90">
                {Math.round(convergenceScore)}%
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">
                {quadrant.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </span>
            </div>
            
            {/* Validation Status Indicators */}
            <div className="flex flex-wrap gap-1 mb-2">
              {node.validationDesirability?.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-xs text-xs bg-green-100 text-green-800">
                  D
                </span>
              )}
              {node.validationFeasibility?.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-xs text-xs bg-blue-100 text-blue-800">
                  F
                </span>
              )}
              {node.validationViability?.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-xs text-xs bg-purple-100 text-purple-800">
                  V
                </span>
              )}
            </div>
            
            {/* Domain Tags (show secondary domains) */}
            {node.secondaryDomains.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 text-xs">
                {node.secondaryDomains.map((domain) => (
                  <span key={domain} className="px-1.5 py-0.5 rounded-xs bg-white/10 text-white/70">
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}