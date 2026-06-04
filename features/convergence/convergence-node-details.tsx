"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useActionState } from "react";
import { addConvergenceFieldNoteAction } from "./actions";
import { Plus, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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

type ConvergenceNodeDetailsProps = {
  nodeId: string;
  onNoteAdded: () => void;
};

export function ConvergenceNodeDetails({ nodeId, onNoteAdded }: ConvergenceNodeDetailsProps) {
  const [state, action, pending] = useActionState(addConvergenceFieldNoteAction, undefined);
  const [notes, setNotes] = useState<ConvergenceFieldNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch notes for this node using browser client
  useEffect(() => {
    async function loadNotes() {
      try {
        setLoading(true);
        const supabase = createClient();
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
          console.error("Error loading convergence field notes:", error);
          setNotes([]);
        } else {
          setNotes(
            (data as any[]).map((note: any) => ({
              id: note.id,
              nodeId: note.nodeId,
              authorId: note.authorId,
              noteType: note.noteType,
              title: note.title,
              body: note.body,
              tags: note.tags || [],
              createdAt: note.createdAt,
              updatedAt: note.updatedAt,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load convergence field notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [nodeId]);

  // Handle form submission
  async function handleSubmit(formData: FormData) {
    // Add the current user's ID - in a real app, you'd get this from auth
    // For now, we'll use a placeholder - this should come from session/auth
    const authorId = "00000000-0000-0000-0000-000000000000"; // Placeholder
    
    formData.append("authorId", authorId);
    formData.append("nodeId", nodeId);
    
    await action(formData);
    
    // Reload notes to show the new one
    onNoteAdded();
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div>
            <CardTitle>Notas de Campo y Validaciones</CardTitle>
            <CardDescription className="mt-2 text-sm">
              Historial de observaciones, validaciones de expertos y reflexiones del equipo
            </CardDescription>
          </div>
        </CardHeader>
        <div className="p-4 text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-b-cyan-300 w-8 h-8"></div>
          <p className="mt-2 text-gray-500">Cargando notas...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div>
          <CardTitle>Notas de Campo y Validaciones</CardTitle>
          <CardDescription className="mt-2 text-sm">
            Historial de observaciones, validaciones de expertos y reflexiones del equipo
          </CardDescription>
        </div>
      </CardHeader>
      
      {/* Notes List */}
      <div className="p-4 space-y-4">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">
            Aún no hay notas de campo para este nodo. Sé el primero en agregar una observación.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="border-l-4 pl-3">
                {/* Note Header */}
                <div className="flex w-between items-start mb-1">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{note.title}</h4>
                    <p className="text-sm text-gray-300 truncate">
                      {note.body}
                    </p>
                  </div>
                  <div className="text-xs flex items-center gap-2">
                    {/* Note Type Badge */}
                    <span className={`px-2 py-0.5 rounded-xs text-xs ${
                      note.noteType === 'field'
                        ? 'bg-blue-100 text-blue-800'
                        : note.noteType === 'expertValidation'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {note.noteType === 'field'
                        ? 'Campo'
                        : note.noteType === 'expertValidation'
                          ? 'Experto'
                          : 'Equipo'}
                    </span>
                    {/* Date */}
                    <span className="text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Tags if any */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 text-xs">
                    {note.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded-xs bg-white/10 text-white/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Note Form */}
      <div className="pt-4 border-t">
        <CardHeader>
          <div>
            <CardTitle>Agregar Nota de Campo</CardTitle>
            <CardDescription className="mt-2 text-sm">
              Comparte observaciones, validaciones de expertos o reflexiones del equipo
            </CardDescription>
          </div>
        </CardHeader>
        <form action={handleSubmit} className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Input
              name="title"
              placeholder="Título de la nota"
              required
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <Textarea
              name="body"
              placeholder="Describe tu observación, validación o insight..."
              rows={4}
              required
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Tipo de nota</label>
              <select
                name="noteType"
                className="w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-300/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="field">Observación de Campo</option>
                <option value="expertValidation">Validación de Experto</option>
                <option value="teamInsight">Reflexión del Equipo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Etiquetas (opcional)</label>
              <Input
                name="tags"
                placeholder="ej. usuario, técnico, costo, seguridad"
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          
          {state?.error && (
            <p className="text-sm text-rose-200 w-full">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="text-sm text-emerald-200 w-full">
              {state.success}
            </p>
          )}
          
          <Button
            type="submit"
            disabled={pending || !!state.error}
            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <>
                <MessageSquare className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Nota
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}