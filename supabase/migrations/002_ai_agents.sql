create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete cascade,
  agent_name text not null,
  query text not null,
  provider text not null,
  analysis text not null,
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.agent_runs enable row level security;

create policy "agent runs own or admin"
on public.agent_runs for all
using (user_id = auth.uid() or public.is_admin() or (project_id is not null and public.is_project_member(project_id)))
with check (user_id = auth.uid() or public.is_admin() or (project_id is not null and public.is_project_member(project_id)));
