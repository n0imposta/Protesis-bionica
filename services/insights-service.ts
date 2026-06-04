export async function extractInsights(input: { source: string; text: string; projectId?: string }) {
  const response = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("No se pudieron extraer insights.");
  }

  return response.json() as Promise<{
    summary: string;
    tags: string[];
    confidence: number;
    nextActions: string[];
  }>;
}
