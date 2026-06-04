# Bionic Prosthetics Innovation Toolkit

Plataforma HealthTech para documentar, investigar, diseñar y validar protesis bionicas accesibles de bajo costo. Esta base usa Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, shadcn-style components, Lucide Icons, Supabase Auth, PostgreSQL, Storage y RLS.

## Arquitectura

- `app/`: rutas App Router, server components, layouts, loading/error boundaries y API routes.
- `features/`: modulos funcionales por dominio: auth, dashboard, bitacora, entrevistas, research, tendencias, convergencia, roadmap, competidores, empathy map, pacientes, observacion y proyectos.
- `components/`: UI reusable y shell de navegacion.
- `lib/`: configuracion, data seed y clientes Supabase.
- `services/`: integraciones cliente/API.
- `store/`: estado global con Zustand.
- `hooks/`: hooks compartidos.
- `supabase/migrations/`: esquema PostgreSQL, constraints, indices, buckets y RLS.

## Modulos incluidos

- Auth: login, registro, reset password y roles.
- Dashboard principal: metricas, proyectos activos, actividad, papers y timeline.
- Bitacora de innovacion: timeline con etiquetas, adjuntos y versionado.
- Entrevistas: expertos, transcripcion, tags, Q&A y extraccion de insights via API.
- Repositorio cientifico: DOI, resumenes, categorias, favoritos y busqueda.
- Tendencias: matriz impacto vs readiness.
- Mapa de convergencia: nodos interactivos entre tecnologia, medicina, IA y rehabilitacion.
- Roadmap tecnologico: hitos historicos, actuales y forecast.
- Competidores: tabla comparativa de precio, sensores, IA y accesibilidad.
- Empathy map: sticky notes por zona.
- Pacientes: perfiles clinicos y sociales.
- Observacion contextual: actividades, entorno, objetos e interacciones.
- Proyectos: portfolio, integrantes, archivos y progreso.

## Setup local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## Supabase

1. Crea un proyecto en Supabase.
2. Copia `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`.
3. Ejecuta la migracion `supabase/migrations/001_initial_schema.sql`.
4. Habilita Auth por email/password.
5. Usa los buckets privados `research-artifacts` y `clinical-media` para papers, videos, audios, fotos y documentos clinicos.

## IA y agentes

Variables soportadas:

- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `NVIDIA_API_KEY`

El modulo `AI Agents` consulta fuentes abiertas y usa el primer proveedor disponible para sintetizar hallazgos. No guardes llaves reales en Git; cargalas en `.env.local` y en Vercel Project Settings.

Fuentes abiertas integradas:

- OpenAlex para literatura academica.
- Europe PMC para literatura biomédica.
- Crossref para DOI y metadata editorial.
- ClinicalTrials.gov para ensayos clinicos.

## Produccion en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Configura variables de entorno de Supabase e IA.
4. Ejecuta las migraciones SQL en Supabase.
5. Despliega con `npm run build`.

## Calidad

```bash
npm run lint
npm run typecheck
npm run build
```

## Seguridad

El modelo de datos usa Row Level Security por membresia de proyecto. Los administradores pueden gestionar miembros y los usuarios solo ven proyectos donde participan. Los artefactos clinicos quedan en buckets privados para evitar exposicion accidental.
