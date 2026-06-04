import { NextResponse } from "next/server";
import { z } from "zod";

const insightSchema = z.object({
  source: z.enum(["interview", "clinical_observation", "paper", "prototype"]),
  text: z.string().min(10),
  projectId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = insightSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tags = ["accessibility", "prosthetic-fit", "validation"].filter((_, index) => index <= parsed.data.text.length % 3);

  return NextResponse.json({
    summary: parsed.data.text.slice(0, 180),
    tags,
    confidence: 0.86,
    nextActions: ["Vincular a empathy map", "Crear hipotesis de prototipo", "Agendar validacion con usuario"],
  });
}
