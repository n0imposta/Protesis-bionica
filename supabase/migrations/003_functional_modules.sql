create table if not exists public.convergence_nodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  label text not null,
  domain text not null,
  description text,
  x int not null default 50 check (x between 0 and 100),
  y int not null default 50 check (y between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.convergence_edges (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  source_node_id uuid not null references public.convergence_nodes(id) on delete cascade,
  target_node_id uuid not null references public.convergence_nodes(id) on delete cascade,
  relationship text not null,
  strength int not null default 50 check (strength between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.convergence_nodes enable row level security;
alter table public.convergence_edges enable row level security;

create policy "convergence nodes members"
on public.convergence_nodes for all
using (project_id is null or public.is_project_member(project_id) or public.is_admin())
with check (project_id is null or public.is_project_member(project_id) or public.is_admin());

create policy "convergence edges members"
on public.convergence_edges for all
using (project_id is null or public.is_project_member(project_id) or public.is_admin())
with check (project_id is null or public.is_project_member(project_id) or public.is_admin());
