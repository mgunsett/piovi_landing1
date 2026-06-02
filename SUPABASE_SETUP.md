# Configuración de Supabase — Panel de Partidos

El Hero muestra **Último Resultado** y **Próximo Partido**. Esos datos se
administran desde `/AdminPage` y viven en Supabase (base de datos + storage
para los escudos + login).

Si Supabase **no** está configurado, la web sigue funcionando con datos de
respaldo (`src/data/matchData.js`) y `/AdminPage` muestra un aviso.

---

## 1. Crear el proyecto

1. Entrá a https://supabase.com → **New project** (plan free).
2. Anotá el **Project URL** y la **anon public key** desde
   *Project Settings → API*.

## 2. Variables de entorno

Creá un archivo `.env` en la raíz (copiá `.env.example`):

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Reiniciá el servidor: `pnpm dev`.

## 3. Base de datos + Storage (SQL)

En Supabase → **SQL Editor** → pegá y ejecutá todo esto:

```sql
-- ── Tabla de partidos ────────────────────────────────────────
create table if not exists public.matches (
  slot        text primary key check (slot in ('last','next')),
  home_team   text not null default '',
  home_shield text,
  away_team   text not null default '',
  away_shield text,
  home_score  int,
  away_score  int,
  match_date  text,
  stadium     text,
  competition text,
  updated_at  timestamptz default now()
);

alter table public.matches enable row level security;

-- Lectura pública (lo que ven los visitantes)
create policy "matches_public_read"
  on public.matches for select
  using (true);

-- Escritura solo para usuarios autenticados (el admin)
create policy "matches_auth_write"
  on public.matches for all
  to authenticated
  using (true) with check (true);

-- ── Storage: bucket de escudos ───────────────────────────────
insert into storage.buckets (id, name, public)
values ('shields', 'shields', true)
on conflict (id) do nothing;

create policy "shields_public_read"
  on storage.objects for select
  using (bucket_id = 'shields');

create policy "shields_auth_insert"
  on storage.objects for insert
  to authenticated with check (bucket_id = 'shields');

create policy "shields_auth_update"
  on storage.objects for update
  to authenticated using (bucket_id = 'shields');

create policy "shields_auth_delete"
  on storage.objects for delete
  to authenticated using (bucket_id = 'shields');
```

## 4. Crear el usuario admin

Supabase → **Authentication → Users → Add user**:

- Email + contraseña (los que usarás para entrar a `/AdminPage`).
- Marcá **Auto Confirm User** (para no requerir verificación por email).

> Tip: en *Authentication → Providers → Email* podés **desactivar
> "Allow new users to sign up"** para que nadie más pueda registrarse.

## 5. Probar

1. `pnpm dev`
2. Abrí `http://localhost:5173/AdminPage`
3. Ingresá con el usuario creado.
4. Cargá Último Resultado y Próximo Partido (subí escudos, guardá).
5. Abrí `http://localhost:5173/` → la caja del Hero refleja los datos.

---

### Notas

- La **anon key** es segura para el frontend: el acceso real lo controlan
  las *RLS policies* de arriba (lectura pública, escritura solo autenticado).
- Los escudos se guardan en el bucket público `shields` y se referencian por
  URL en la tabla `matches`.
