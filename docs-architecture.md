# Arquitectura tecnica

## Principios

La aplicacion separa dominios por feature para permitir crecimiento modular. Cada modulo puede evolucionar con sus propios componentes, acciones, servicios y validaciones sin acoplarse al dashboard.

## Clean Architecture aplicada

- Presentacion: `app/`, `components/`, vistas en `features/*/*-view.tsx`.
- Casos de uso: server actions y servicios de feature.
- Infraestructura: `lib/supabase`, `services`, API routes.
- Dominio: tipos en `types/domain.ts` y tablas PostgreSQL.

## Backend

Supabase Auth administra identidad. PostgreSQL almacena proyectos, miembros, bitacoras, entrevistas, insights, papers, tendencias, roadmap, competidores, pacientes, empathy notes y observaciones contextuales. RLS protege cada registro por `project_members`.

## Frontend

Next.js App Router usa Server Components por defecto. Los componentes interactivos estan aislados con `"use client"`: graficos, mapa de convergencia, empathy board, formularios y notificaciones.

## Roadmap de implementacion siguiente

1. Conectar lecturas reales Supabase por modulo.
2. Agregar CRUD completo con Server Actions por feature.
3. Implementar Storage signed URLs.
4. Agregar tests de integracion para RLS.
5. Incorporar busqueda full-text y filtros avanzados.
6. Agregar colaboracion realtime para empathy map y bitacora.
