"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { extractInsights } from "@/services/insights-service";

const schema = z.object({
  expert: z.string().min(2),
  context: z.string().min(2),
  notes: z.string().min(10),
});

type InterviewFormInput = z.infer<typeof schema>;

export function InterviewForm() {
  const [tags, setTags] = useState<string[]>([]);
  const { register, handleSubmit, formState } = useForm<InterviewFormInput>({
    resolver: zodResolver(schema),
    defaultValues: { expert: "", context: "", notes: "" },
  });

  async function onSubmit(values: InterviewFormInput) {
    const result = await extractInsights({ source: "interview", text: `${values.expert}. ${values.context}. ${values.notes}` });
    setTags(result.tags);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="Nombre del experto" {...register("expert")} />
      <Input placeholder="Institucion o contexto" {...register("context")} />
      <Textarea placeholder="Preguntas, respuestas y notas de campo" {...register("notes")} />
      {formState.errors.notes && <p className="text-sm text-rose-200">Agrega al menos 10 caracteres de notas.</p>}
      <Button className="w-full" disabled={formState.isSubmitting}>
        <WandSparkles className="h-4 w-4" /> {formState.isSubmitting ? "Analizando..." : "Extraer insights"}
      </Button>
      {tags.length > 0 && <div className="flex flex-wrap gap-2">{tags.map((tag) => <Badge key={tag} tone="mint">{tag}</Badge>)}</div>}
    </form>
  );
}
