create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'researcher', 'engineer', 'medical_specialist', 'student');
create type public.project_status as enum ('discovery', 'prototype', 'clinical_validation', 'manufacturing', 'paused');
create type public.artifact_type as enum ('note', 'photo', 'video', 'pdf', 'audio', 'sketch', 'decision', 'problem', 'prototype_version', 'clinical_observation');
create type public.expert_type as enum ('physician', 'biomedical_engineer', 'amputee_patient', 'kinesiologist', 'occupational_therapist', 'industrial_designer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  career text not null default 'Sin especificar',
  role public.user_role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, career, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'career', 'Sin especificar'),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.project_status not null default 'discovery',
  objectives text[] not null default '{}',
  progress int not null default 0 check (progress between 0 and 100),
  owner_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.innovation_log_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  type public.artifact_type not null,
  title text not null,
  body text,
  tags text[] not null default '{}',
  prototype_version text,
  version int not null default 1,
  created_at timestamptz not null default now()
);

create table public.experts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.expert_type not null,
  organization text,
  consent_document_path text,
  created_at timestamptz not null default now()
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  expert_id uuid references public.experts(id),
  interviewer_id uuid references public.profiles(id),
  title text not null,
  transcript text,
  media_path text,
  tags text[] not null default '{}',
  qna jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_table text not null,
  source_id uuid,
  title text not null,
  summary text not null,
  tags text[] not null default '{}',
  confidence numeric(4,3) not null default 0.750,
  created_at timestamptz not null default now()
);

create table public.research_papers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  doi text unique,
  abstract text,
  category text not null,
  keywords text[] not null default '{}',
  file_path text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.technology_trends (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  category text not null,
  impact int not null check (impact between 0 and 100),
  readiness int not null check (readiness between 0 and 100),
   "references" jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.roadmap_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  domain text not null,
  milestone_year int not null,
  maturity int not null check (maturity between 0 and 100),
  status text not null check (status in ('historical', 'active', 'forecast')),
  created_at timestamptz not null default now()
);

create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  product text not null,
  price_range text,
  technology text,
  accessibility int check (accessibility between 0 and 100),
  materials text[],
  sensors text,
  ai_capability text,
  personalization text,
  created_at timestamptz not null default now()
);

create table public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  code text not null unique,
  age int check (age between 0 and 120),
  amputation_type text not null,
  social_context text,
  needs text[],
  limitations text[],
  goals text[],
  activities text[],
  clinical_notes text,
  created_at timestamptz not null default now()
);

create table public.empathy_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  patient_profile_id uuid references public.patient_profiles(id) on delete cascade,
  zone text not null check (zone in ('thinks', 'feels', 'says', 'does', 'pains', 'needs')),
  content text not null,
  position jsonb not null default '{"x":0,"y":0}'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.contextual_observations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  patient_profile_id uuid references public.patient_profiles(id),
  activity text not null,
  environment text,
  objects_used text[],
  interactions text[],
  observations text,
  media_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_project_members_user on public.project_members(user_id);
create index idx_log_project_created on public.innovation_log_entries(project_id, created_at desc);
create index idx_interviews_project_created on public.interviews(project_id, created_at desc);
create index idx_papers_search on public.research_papers using gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(abstract,'')));
create index idx_insights_tags on public.insights using gin(tags);
create index idx_trends_project on public.technology_trends(project_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.innovation_log_entries enable row level security;
alter table public.experts enable row level security;
alter table public.interviews enable row level security;
alter table public.insights enable row level security;
alter table public.research_papers enable row level security;
alter table public.technology_trends enable row level security;
alter table public.roadmap_milestones enable row level security;
alter table public.competitors enable row level security;
alter table public.patient_profiles enable row level security;
alter table public.empathy_notes enable row level security;
alter table public.contextual_observations enable row level security;

create or replace function public.is_project_member(target_project_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.project_members pm
    where pm.project_id = target_project_id and pm.user_id = auth.uid()
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create policy "profiles read own" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles for update using (id = auth.uid());

create policy "projects read members" on public.projects for select using (public.is_project_member(id) or public.is_admin());
create policy "projects insert authenticated" on public.projects for insert with check (auth.uid() is not null);
create policy "projects update members" on public.projects for update using (public.is_project_member(id) or public.is_admin());

create policy "members read project" on public.project_members for select using (user_id = auth.uid() or public.is_project_member(project_id) or public.is_admin());
create policy "members manage admin" on public.project_members for all using (public.is_admin()) with check (public.is_admin());
create policy "members insert self" on public.project_members for insert with check (user_id = auth.uid());

create policy "log project members" on public.innovation_log_entries for all using (public.is_project_member(project_id) or public.is_admin()) with check (public.is_project_member(project_id) or public.is_admin());
create policy "interviews project members" on public.interviews for all using (public.is_project_member(project_id) or public.is_admin()) with check (public.is_project_member(project_id) or public.is_admin());
create policy "insights project members" on public.insights for all using (public.is_project_member(project_id) or public.is_admin()) with check (public.is_project_member(project_id) or public.is_admin());
create policy "trends project members" on public.technology_trends for all using (project_id is null or public.is_project_member(project_id) or public.is_admin()) with check (project_id is null or public.is_project_member(project_id) or public.is_admin());
create policy "roadmap project members" on public.roadmap_milestones for all using (public.is_project_member(project_id) or public.is_admin()) with check (public.is_project_member(project_id) or public.is_admin());
create policy "patients project members" on public.patient_profiles for all using (project_id is null or public.is_project_member(project_id) or public.is_admin()) with check (project_id is null or public.is_project_member(project_id) or public.is_admin());
create policy "empathy project members" on public.empathy_notes for all using (public.is_project_member(project_id) or public.is_admin()) with check (public.is_project_member(project_id) or public.is_admin());
create policy "observations project members" on public.contextual_observations for all using (public.is_project_member(project_id) or public.is_admin()) with check (public.is_project_member(project_id) or public.is_admin());
create policy "papers readable to authenticated" on public.research_papers for select using (auth.uid() is not null);
create policy "papers project members write" on public.research_papers for all using (project_id is null or public.is_project_member(project_id) or public.is_admin()) with check (project_id is null or public.is_project_member(project_id) or public.is_admin());
create policy "experts authenticated" on public.experts for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "competitors authenticated" on public.competitors for all using (auth.uid() is not null) with check (auth.uid() is not null);

insert into storage.buckets (id, name, public)
values ('research-artifacts', 'research-artifacts', false),
       ('clinical-media', 'clinical-media', false)
on conflict (id) do nothing;
