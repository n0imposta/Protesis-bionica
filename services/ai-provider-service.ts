import { env } from "@/lib/env";
import type { IntelligenceResult } from "@/types/domain";

type Provider = "gemini" | "groq" | "nvidia" | "none";

function getProvider(): Provider {
  if (env.GEMINI_API_KEY) return "gemini";
  if (env.GROQ_API_KEY) return "groq";
  if (env.NVIDIA_API_KEY) return "nvidia";
  return "none";
}

function buildPrompt(query: string, results: IntelligenceResult[]) {
  return `Analiza estos hallazgos para una plataforma de protesis bionicas accesibles.
Consulta: ${query}
Devuelve en español:
1. señales relevantes
2. riesgos
3. oportunidades de producto
4. papers o ensayos prioritarios
5. proximas acciones

Datos:
${results.map((item, index) => `${index + 1}. [${item.source}] ${item.title} - ${item.summary} (${item.url})`).join("\n")}`;
}

export async function analyzeWithAi(query: string, results: IntelligenceResult[]) {
  const provider = getProvider();
  const prompt = buildPrompt(query, results);

  if (provider === "none") {
    return {
      provider,
      analysis: "No hay proveedor IA configurado. Agrega GEMINI_API_KEY, GROQ_API_KEY o NVIDIA_API_KEY para activar analisis automatico.",
    };
  }

  if (provider === "gemini") {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const payload = await response.json();
    return { provider, analysis: payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "Gemini no devolvio analisis." };
  }

  const endpoint = provider === "groq" ? "https://api.groq.com/openai/v1/chat/completions" : "https://integrate.api.nvidia.com/v1/chat/completions";
  const key = provider === "groq" ? env.GROQ_API_KEY : env.NVIDIA_API_KEY;
  const model = provider === "groq" ? "llama-3.1-8b-instant" : "meta/llama-3.1-8b-instruct";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });
  const payload = await response.json();
  return { provider, analysis: payload.choices?.[0]?.message?.content ?? "El proveedor no devolvio analisis." };
}
