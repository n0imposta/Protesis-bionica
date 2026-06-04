import Link from "next/link";
import { navigation } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Bell, Command, Search } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="medical-grid min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-slate-950/65 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10">
            <Activity className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Bionic Prosthetics</p>
            <p className="text-xs text-slate-400">Innovation Toolkit</p>
          </div>
        </Link>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Command className="h-4 w-4 text-cyan-200" />
            Workspace
          </div>
          <p className="mt-2 text-sm font-medium text-white">Low-Cost Bionic Lab</p>
          <Badge tone="mint" className="mt-3">RLS protegido</Badge>
        </div>

        <nav className="mt-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <item.icon className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-200" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-400 lg:max-w-md">
              <Search className="h-4 w-4" />
              <span className="truncate">Buscar proyectos, papers, entrevistas, pacientes...</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notificaciones">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="secondary" className="hidden sm:inline-flex">Nuevo insight</Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
