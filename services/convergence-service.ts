import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

// Types for our enhanced convergence nodes
export type ConvergenceNode = {
  id: string;
  label: string;
  primaryDomain: 'healthcare' | 'tech' | 'consumerCulture' | 'environment';
  secondaryDomains: ('healthcare' | 'tech' | 'consumerCulture' | 'environment')[];
  description: string | null;
  x: number; // Impact (0-100)
  y: number; // Feasibility (0-100)
  status: 'underReview' | 'approvedForPrototyping' | 'discarded' | 'inPrototyping' | 'validated';
  validationDesirability: string | null; // Etapa 3: Conocer a las Personas
  validationFeasibility: string | null;  // Etapa 2: Conocer el Contexto
  validationViability: string | null;    // Etapa 1+2: Sentido de Intencionalidad + Contexto
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConvergenceFieldNote = {
  id: string;
  nodeId: string;
  authorId: string;
  noteType: 'field' | 'expertValidation' | 'teamInsight';
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

// Enhanced service methods
export async function getConvergenceNodes() {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("convergence_nodes")
    .select(`
      id,
      label,
      primaryDomain,
      secondaryDomains,
      description,
      x,
      y,
      status,
      validationDesirability,
      validationFeasibility,
      validationViability,
      projectId,
      createdAt,
      updatedAt
    `)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

// Keep the rest of the functions unchanged for now...
export async function getConvergenceNodeById(nodeId: string) {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("convergence_nodes")
    .select(`
      id,
      label,
      primaryDomain,
      secondaryDomains,
      description,
      x,
      y,
      status,
      validationDesirability,
      validationFeasibility,
      validationViability,
      projectId,
      createdAt,
      updatedAt
    `)
    .eq("id", nodeId)
    .single();
  
  if (error) {
    console.error("Error fetching convergence node:", error);
    return null;
  }
  
  return data as ConvergenceNode | null;
}

export async function createConvergenceNode(nodeData: Omit<ConvergenceNode, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar nodos de convergencia." };
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("convergence_nodes")
    .insert({
      label: nodeData.label,
      primaryDomain: nodeData.primaryDomain,
      secondaryDomains: nodeData.secondaryDomains,
      description: nodeData.description,
      x: nodeData.x,
      y: nodeData.y,
      status: nodeData.status,
      validationDesirability: nodeData.validationDesirability,
      validationFeasibility: nodeData.validationFeasibility,
      validationViability: nodeData.validationViability,
      projectId: nodeData.projectId
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating convergence node:", error);
    return { error: error.message };
  }
  
  return { data: data as ConvergenceNode, error: null };
}

export async function updateConvergenceNode(nodeId: string, updates: Partial<Omit<ConvergenceNode, 'id' | 'createdAt'>>) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para actualizar nodos de convergencia." };
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("convergence_nodes")
    .update({
      ...updates,
      updatedAt: new Date().toISOString()
    })
    .eq("id", nodeId)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating convergence node:", error);
    return { error: error.message };
  }
  
  return { data: data as ConvergenceNode, error: null };
}

export async function addConvergenceFieldNote(noteData: Omit<ConvergenceFieldNote, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!isSupabaseConfigured) return { error: "Configura Supabase para guardar notas de campo." };
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("convergence_field_notes")
    .insert({
      nodeId: noteData.nodeId,
      authorId: noteData.authorId,
      noteType: noteData.noteType,
      title: noteData.title,
      body: noteData.body,
      tags: noteData.tags
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error adding convergence field note:", error);
    return { error: error.message };
  }
  
  return { data: data as ConvergenceFieldNote, error: null };
}

export async function getConvergenceFieldNotes(nodeId: string) {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("convergence_field_notes")
    .select(`
      id,
      nodeId,
      authorId,
      noteType,
      title,
      body,
      tags,
      createdAt,
      updatedAt
    `)
    .eq("nodeId", nodeId)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching convergence field notes:", error);
    return [];
  }
  
  return (data as ConvergenceFieldNote[]) ?? [];
}

export async function updateConvergenceNodeStatus(nodeId: string, status: ConvergenceNode['status']) {
  return updateConvergenceNode(nodeId, { status });
}

export async function validateConvergenceNode(
  nodeId: string, 
  validation: {
    desirability?: string;
    feasibility?: string;
    viability?: string;
  }
) {
  const updates: Partial<ConvergenceNode> = {};
  
  if (validation.desirability !== undefined) {
    updates.validationDesirability = validation.desirability;
  }
  if (validation.feasibility !== undefined) {
    updates.validationFeasibility = validation.feasibility;
  }
  if (validation.viability !== undefined) {
    updates.validationViability = validation.viability;
  }
  
  // Auto-update status based on validation completeness
  const currentNode = await getConvergenceNodeById(nodeId);
  if (currentNode) {
    const hasAllValidations = 
      (validation.desirability !== undefined || currentNode.validationDesirability !== null) &&
      (validation.feasibility !== undefined || currentNode.validationFeasibility !== null) &&
      (validation.viability !== undefined || currentNode.validationViability !== null);
    
    if (hasAllValidations && 
        validation.desirability?.length > 0 && 
        validation.feasibility?.length > 0 && 
        validation.viability?.length > 0) {
      // Check if validations are positive (basic check - in reality would need sentiment analysis)
      updates.status = 'approvedForPrototyping';
    }
  }
  
  return updateConvergenceNode(nodeId, updates);
}

// Helper function to calculate convergence score
export function calculateConvergenceScore(node: ConvergenceNode): number {
  // Base score from position (distance from origin in impact-feasibility space)
  const positionScore = Math.sqrt(node.x * node.x + node.y * node.y) / Math.sqrt(20000); // Normalize to 0-1
  
  // Bonus for multi-domain convergence
  const domainBonus = Math.min(node.secondaryDomains.length * 0.1, 0.3); // Max 30% bonus
  
  // Bonus for validation completeness
  const validationScore = 
    ((node.validationDesirability?.length ?? 0) > 0 ? 0.2 : 0) +
    ((node.validationFeasibility?.length ?? 0) > 0 ? 0.2 : 0) +
    ((node.validationViability?.length ?? 0) > 0 ? 0.2 : 0);
  
  return Math.min((positionScore + domainBonus + validationScore) * 100, 100);
}

export function getConvergenceQuadrant(node: ConvergenceNode): string {
  if (node.x >= 60 && node.y >= 60) return "highImpactHighFeasibility";
  if (node.x < 60 && node.y >= 60) return "lowImpactHighFeasibility";
  if (node.x >= 60 && node.y < 60) return "highImpactLowFeasibility";
  return "lowImpactLowFeasibility";
}