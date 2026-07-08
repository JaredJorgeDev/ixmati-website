create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'student' check (role in ('student','flor','instructor','superadmin','vip')),
  created_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student','flor','instructor','superadmin','vip'));

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  status text not null default 'published'
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text unique not null,
  title text not null,
  order_index int not null default 0
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text unique not null,
  title text not null,
  content jsonb,
  order_index int not null default 0
);

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'completed',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text unique not null,
  title text not null,
  instructions text,
  rubric jsonb,
  order_index int not null default 0
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  content jsonb,
  status text not null default 'submitted' check (status in ('submitted','aprobado','rechazado','requiere_correccion')),
  grade numeric,
  feedback text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text unique not null,
  title text not null,
  order_index int not null default 0
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score numeric not null,
  answers jsonb,
  passed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.production_op_state (
  op_id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.production_custom_ops (
  op_id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_academy_reviewer()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_profile_role() in ('superadmin','instructor'), false)
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.student_progress enable row level security;
alter table public.activities enable row level security;
alter table public.submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.production_op_state enable row level security;
alter table public.production_custom_ops enable row level security;

drop policy if exists "profiles_select_own_or_reviewer" on public.profiles;
create policy "profiles_select_own_or_reviewer" on public.profiles
for select using (id = auth.uid() or public.is_academy_reviewer());

drop policy if exists "profiles_update_reviewer" on public.profiles;
create policy "profiles_update_reviewer" on public.profiles
for update using (public.is_academy_reviewer()) with check (public.is_academy_reviewer());

drop policy if exists "academy_content_read" on public.courses;
create policy "academy_content_read" on public.courses for select using (auth.role() = 'authenticated');
drop policy if exists "modules_read" on public.modules;
create policy "modules_read" on public.modules for select using (auth.role() = 'authenticated');
drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select using (auth.role() = 'authenticated');
drop policy if exists "activities_read" on public.activities;
create policy "activities_read" on public.activities for select using (auth.role() = 'authenticated');
drop policy if exists "quizzes_read" on public.quizzes;
create policy "quizzes_read" on public.quizzes for select using (auth.role() = 'authenticated');

drop policy if exists "progress_select_own_or_reviewer" on public.student_progress;
create policy "progress_select_own_or_reviewer" on public.student_progress
for select using (user_id = auth.uid() or public.is_academy_reviewer());
drop policy if exists "progress_insert_own" on public.student_progress;
create policy "progress_insert_own" on public.student_progress
for insert with check (user_id = auth.uid());
drop policy if exists "progress_update_own" on public.student_progress;
create policy "progress_update_own" on public.student_progress
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "submissions_select_own_or_reviewer" on public.submissions;
create policy "submissions_select_own_or_reviewer" on public.submissions
for select using (user_id = auth.uid() or public.is_academy_reviewer());
drop policy if exists "submissions_insert_own" on public.submissions;
create policy "submissions_insert_own" on public.submissions
for insert with check (user_id = auth.uid());
drop policy if exists "submissions_update_reviewer" on public.submissions;
create policy "submissions_update_reviewer" on public.submissions
for update using (public.is_academy_reviewer()) with check (public.is_academy_reviewer());

drop policy if exists "quiz_attempts_select_own_or_reviewer" on public.quiz_attempts;
create policy "quiz_attempts_select_own_or_reviewer" on public.quiz_attempts
for select using (user_id = auth.uid() or public.is_academy_reviewer());
drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own" on public.quiz_attempts
for insert with check (user_id = auth.uid());

drop policy if exists "production_state_read_authenticated" on public.production_op_state;
create policy "production_state_read_authenticated" on public.production_op_state
for select using (auth.role() = 'authenticated');
drop policy if exists "production_state_write_team" on public.production_op_state;
create policy "production_state_write_team" on public.production_op_state
for insert with check (auth.role() = 'authenticated');
drop policy if exists "production_state_update_team" on public.production_op_state;
create policy "production_state_update_team" on public.production_op_state
for update using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "production_custom_ops_read_authenticated" on public.production_custom_ops;
create policy "production_custom_ops_read_authenticated" on public.production_custom_ops
for select using (auth.role() = 'authenticated');
drop policy if exists "production_custom_ops_insert_admin" on public.production_custom_ops;
create policy "production_custom_ops_insert_admin" on public.production_custom_ops
for insert with check (auth.role() = 'authenticated');
drop policy if exists "production_custom_ops_update_admin" on public.production_custom_ops;
create policy "production_custom_ops_update_admin" on public.production_custom_ops
for update using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public, file_size_limit)
values ('production-deliveries', 'production-deliveries', true, 104857600)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

drop policy if exists "production_deliveries_read_authenticated" on storage.objects;
create policy "production_deliveries_read_authenticated" on storage.objects
for select using (bucket_id = 'production-deliveries' and auth.role() = 'authenticated');

drop policy if exists "production_deliveries_insert_team" on storage.objects;
create policy "production_deliveries_insert_team" on storage.objects
for insert with check (
  bucket_id = 'production-deliveries'
  and auth.role() = 'authenticated'
);

drop policy if exists "production_deliveries_update_team" on storage.objects;
create policy "production_deliveries_update_team" on storage.objects
for update using (
  bucket_id = 'production-deliveries'
  and auth.role() = 'authenticated'
) with check (
  bucket_id = 'production-deliveries'
  and auth.role() = 'authenticated'
);

insert into public.courses (slug, title, description, status)
values ('universidad-ixmati', 'Universidad Ixmati', 'Capacitacion interna y operacion digital.', 'published')
on conflict (slug) do update set title = excluded.title, description = excluded.description, status = excluded.status;

with course as (select id from public.courses where slug = 'universidad-ixmati')
insert into public.modules (course_id, slug, title, order_index)
select course.id, data.slug, data.title, data.order_index
from course, (values
  ('estudio-visual','Estudio Visual',1),
  ('web','Desarrollo Web',2),
  ('marketing','Marketing Digital',3),
  ('comercial','Area Comercial',4),
  ('operacion','Operacion Interna',5)
) as data(slug,title,order_index)
on conflict (slug) do update set title = excluded.title, order_index = excluded.order_index;

with lesson_seed(module_slug, slug, title, order_index) as (values
  ('estudio-visual','estudio-visual-leccion-01','Preparacion correcta de archivos para impresion',1),
  ('estudio-visual','estudio-visual-leccion-02','Errores comunes en archivos de clientes',2),
  ('estudio-visual','estudio-visual-leccion-03','Diseno para impresion vs diseno digital',3),
  ('estudio-visual','estudio-visual-leccion-04','Lonas, viniles y rotulacion',4),
  ('estudio-visual','estudio-visual-leccion-05','Recepcion de archivos de clientes',5),
  ('estudio-visual','estudio-visual-leccion-06','Orden de produccion visual',6),
  ('web','web-leccion-01','Como identificar que necesita el cliente',1),
  ('web','web-leccion-02','Informacion antes de iniciar una web',2),
  ('web','web-leccion-03','Como explicar una landing',3),
  ('web','web-leccion-04','Setup y mantenimiento web',4),
  ('marketing','marketing-leccion-01','Que quiere decir la gente cuando pide redes',1),
  ('marketing','marketing-leccion-02','Meta Ads vs Google Ads para negocios locales',2),
  ('marketing','marketing-leccion-03','Datos antes de ofrecer campanas',3),
  ('marketing','marketing-leccion-04','Que NO prometer',4),
  ('comercial','comercial-leccion-01','Proceso comercial Ixmati',1),
  ('comercial','comercial-leccion-02','Diagnostico consultivo',2),
  ('comercial','comercial-leccion-03','SETUP',3),
  ('comercial','comercial-leccion-04','Mensualidad',4),
  ('operacion','operacion-leccion-01','Como registrar un prospecto',1),
  ('operacion','operacion-leccion-02','Pasar informacion a Jared o Jad',2),
  ('operacion','operacion-leccion-03','Pedir archivos y confirmar entregas',3),
  ('operacion','operacion-leccion-04','Documentar cambios y cerrar conversacion',4)
)
insert into public.lessons (module_id, slug, title, content, order_index)
select m.id, s.slug, s.title, '{}'::jsonb, s.order_index
from lesson_seed s
join public.modules m on m.slug = s.module_slug
on conflict (slug) do update set title = excluded.title, order_index = excluded.order_index;

with activity_seed(module_slug, slug, title, instructions, order_index) as (values
  ('estudio-visual','estudio-visual-actividad-practica','Actividad practica Estudio Visual','Revisar un archivo ficticio para impresion.',1),
  ('web','web-actividad-practica','Actividad practica Web','Clasificar 10 negocios reales por solucion web recomendada.',1),
  ('marketing','marketing-actividad-practica','Actividad practica Marketing','Responder a un cliente que dice quiero redes.',1),
  ('comercial','comercial-actividad-practica','Actividad practica Comercial','Clasificar mensajes de prospectos y elegir respuesta correcta.',1),
  ('operacion','operacion-actividad-practica','Actividad practica Operacion','Llenar ficha de prospecto y pasar informacion interna.',1)
)
insert into public.activities (module_id, slug, title, instructions, rubric, order_index)
select m.id, s.slug, s.title, s.instructions, '{}'::jsonb, s.order_index
from activity_seed s
join public.modules m on m.slug = s.module_slug
on conflict (slug) do update set title = excluded.title, instructions = excluded.instructions;

with quiz_seed(module_slug, slug, title, order_index) as (values
  ('estudio-visual','estudio-visual-evaluacion-final','Evaluacion Estudio Visual',1),
  ('web','web-evaluacion-final','Evaluacion Desarrollo Web',1),
  ('marketing','marketing-evaluacion-final','Evaluacion Marketing Digital',1),
  ('comercial','comercial-evaluacion-final','Evaluacion Comercial',1),
  ('operacion','operacion-evaluacion-final','Evaluacion Operacion Interna',1)
)
insert into public.quizzes (module_id, slug, title, order_index)
select m.id, s.slug, s.title, s.order_index
from quiz_seed s
join public.modules m on m.slug = s.module_slug
on conflict (slug) do update set title = excluded.title;
