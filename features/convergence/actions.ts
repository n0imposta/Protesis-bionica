"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";

// Helper function to get array values from FormData
function getFormDataArray(formData: FormData, key: string): string[] {
  const values: string[] = [];
  formData.forEach((value) => {
    values.push(value as string);
  });
  // Actually, we need to check the key too
  const results: string[] = [];
  formData.forEach((value, formKey) => {
    if (formKey === key && value !== "") {
      results.push(value as string);
    }
  });
  return results;
}

// Helper function to get single value from FormData
function getFormDataString(formData: FormData, key: string): string | undefined {
  let result: string | undefined;
  formData.forEach((value, formKey) => {
    if (formKey === key && value !== "") {
      result = value as string;
    }
  });
  return result;
}

// Schema for convergence node creation
const nodeSchema = z.object({
  projectId: z.string().uuid().optional().or(z.literal("")),
  label: z.string().min(2),
  primaryDomain: z.enum(["healthcare", "tech", "consumerCulture", "environment"]),
  secondaryDomains: z.array(z.enum(["healthcare", "tech", "consumerCulture", "environment"])).max(3),
  description: z.string().optional(),
  x: z.coerce.number().int().min(0).max(100),
  y: z.coerce.number().int().min(0).max(100),
  validationDesirability: z.string().optional(),
  validationFeasibility: z.string().optional(),
  validationViability: z.string().optional(),
  status: z.enum(["underReview", "approvedForPrototyping", "discarded", "inPrototyping", "validated"]).default("underReview"),
});

export async function createConvergenceNodeAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Configura Supabase para guardar nodos de convergencia." };
  }
  
  const rawData = {
    projectId: getFormDataString(formData, "projectId") || undefined,
    label: getFormDataString(formData, "label"),
    primaryDomain: getFormDataString(formData, "primaryDomain"),
    secondaryDomains: getFormDataArray(formData, "secondaryDomains[]"),
    description: getFormDataString(formData, "description"),
    x: getFormDataString(formData, "x") ? parseInt(getFormDataString(formData, "x")!, 10) : undefined,
    y: getFormDataString(formData, "y") ? parseInt(getFormDataString(formData, "y")!, 10) : undefined,
    validationDesirability: getFormDataString(formData, "validationDesirability"),
    validationFeasibility: getFormDataString(formData, "validationFeasibility"),
    validationViability: getFormDataString(formData, "validationViability"),
    status: getFormDataString(formData, "status") || "underReview",
  };

  const parsed = nodeSchema.safeParse(rawData);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const supabase = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const { data, error } = await supabase
    .from("convergence_nodes")
    .insert({
      project_id: parsed.data.projectId || null,
      label: parsed.data.label,
      primaryDomain: parsed.data.primaryDomain,
      secondaryDomains: parsed.data.secondaryDomains,
      description: parsed.data.description || null,
      x: parsed.data.x,
      y: parsed.data.y,
      validationDesirability: parsed.data.validationDesirability || null,
      validationFeasibility: parsed.data.validationFeasibility || null,
      validationViability: parsed.data.validationViability || null,
      status: parsed.data.status,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating convergence node:", error);
    return { error: error.message };
  }
  
  revalidatePath("/convergence");
  return { success: "Nodo de convergencia creado." };
}

// Action to update convergence node
const updateSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(2).optional(),
  primaryDomain: z.enum(["healthcare", "tech", "consumerCulture", "environment"]).optional(),
  secondaryDomains: z.array(z.enum(["healthcare", "tech", "consumerCulture", "environment"])).max(3).optional(),
  description: z.string().optional(),
  x: z.coerce.number().int().min(0).max(100).optional(),
  y: z.coerce.number().int().min(0).max(100).optional(),
  validationDesirability: z.string().optional(),
  validationFeasibility: z.string().optional(),
  validationViability: z.string().optional(),
  status: z.enum(["underReview", "approvedForPrototyping", "discarded", "inPrototyping", "validated"]).optional(),
});

export async function updateConvergenceNodeAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Configura Supabase para actualizar nodos de convergencia." };
  }
  
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const supabase = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const { data, error } = await supabase
    .from("convergence_nodes")
    .update({
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating convergence node:", error);
    return { error: error.message };
  }
  
  revalidatePath("/convergence");
  return { success: "Nodo de convergencia actualizado." };
}

// Action to add field notes
const fieldNoteSchema = z.object({
  nodeId: z.string().uuid(),
  authorId: z.string().uuid(),
  noteType: z.enum(["field", "expertValidation", "teamInsight"]),
  title: z.string().min(2),
  body: z.string().min(10),
  tags: z.array(z.string()).default([]),
});

export async function addConvergenceFieldNoteAction(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Configura Supabase para guardar notas de campo." };
  }
  
  const parsed = fieldNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const supabase = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const { data, error } = await supabase
    .from("convergence_field_notes")
    .insert({
      nodeId: parsed.data.nodeId,
      authorId: parsed.data.authorId,
      noteType: parsed.data.noteType,
      title: parsed.data.title,
      body: parsed.data.body,
      tags: parsed.data.tags,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding convergence field note:", error);
    return { error: error.message };
  }
  
  revalidatePath(`/convergence/node/${parsed.data.nodeId}`);
  return { success: "Nota de campo añadida." };
}