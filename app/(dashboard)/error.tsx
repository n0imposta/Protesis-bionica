"use client";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="glass-panel rounded-lg p-8">
      <p className="text-sm text-rose-200">Error de modulo</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">{error.message}</h1>
      <Button className="mt-5" onClick={reset}>Reintentar</Button>
    </div>
  );
}
