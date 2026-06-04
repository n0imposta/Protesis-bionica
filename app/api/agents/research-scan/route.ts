import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeWithAi } from "@/services/ai-provider-service";
import { runMultiSourceSearch } from "@/services/external-intelligence-service";

const schema = z.object({ query: z.string().min(3) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const results = await runMultiSourceSearch(parsed.data.query);
  const ai = await analyzeWithAi(parsed.data.query, results);

  return NextResponse.json({ ...ai, results });
}
