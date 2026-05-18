-- ============================================================
-- STEELTEAM PLATFORM — Supabase SQL Schema
-- Chạy file này trong: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. USERS (profile mở rộng từ auth.users) ─────────────────
create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  role       text not null check (role in ('admin', 'lead', 'dev')),
  avatar     text,
  dept       text,
  online     boolean default false,
  created_at timestamptz default now()
);

-- ── 2. PROJECTS ───────────────────────────────────────────────
create table public.projects (
  id         bigserial primary key,
  name       text not null,
  code       text unique not null,
  status     text not null check (status in ('active', 'completed', 'planning')),
  progress   int default 0 check (progress between 0 and 100),
  lead_id    uuid references public.users(id),
  deadline   date,
  phase      text,
  tasks      int default 0,
  done       int default 0,
  created_at timestamptz default now()
);

-- ── 3. PROJECT_MEMBERS (many-to-many) ────────────────────────
create table public.project_members (
  project_id bigint references public.projects(id) on delete cascade,
  user_id    uuid references public.users(id) on delete cascade,
  primary key (project_id, user_id)
);

-- ── 4. TASKS ─────────────────────────────────────────────────
create table public.tasks (
  id         bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  title      text not null,
  assignee_id uuid references public.users(id),
  priority   text check (priority in ('low', 'medium', 'high', 'critical')),
  status     text check (status in ('todo', 'inprogress', 'review', 'done')),
  type       text,
  due        date,
  created_at timestamptz default now()
);

-- ── 5. DOCUMENTS ─────────────────────────────────────────────
create table public.documents (
  id         bigserial primary key,
  name       text not null,
  category   text check (category in ('project', 'standard', 'template', 'guide')),
  size       text,
  type       text,
  project_id bigint references public.projects(id),
  file_url   text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ── 6. QUALITY_ISSUES ────────────────────────────────────────
create table public.quality_issues (
  id         bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  title      text not null,
  type       text check (type in ('error', 'improvement')),
  severity   text check (severity in ('low', 'medium', 'high', 'critical')),
  status     text check (status in ('open', 'resolved', 'pending')),
  reporter_id uuid references public.users(id),
  tag        text,
  recurring  boolean default false,
  created_at timestamptz default now()
);

-- ── 7. PLUGINS ───────────────────────────────────────────────
create table public.plugins (
  id         bigserial primary key,
  name       text not null,
  description text,
  icon       text,
  status     text check (status in ('connected', 'available')),
  category   text,
  created_at timestamptz default now()
);

-- ── 8. ACTIVITY ──────────────────────────────────────────────
create table public.activity (
  id         bigserial primary key,
  user_id    uuid references public.users(id),
  action     text not null,
  target     text,
  project_id bigint references public.projects(id),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.users          enable row level security;
alter table public.projects       enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks          enable row level security;
alter table public.documents      enable row level security;
alter table public.quality_issues enable row level security;
alter table public.plugins        enable row level security;
alter table public.activity       enable row level security;

-- Cho phép user đã xác thực đọc tất cả
create policy "authenticated read all" on public.users          for select using (auth.role() = 'authenticated');
create policy "authenticated read all" on public.projects       for select using (auth.role() = 'authenticated');
create policy "authenticated read all" on public.project_members for select using (auth.role() = 'authenticated');
create policy "authenticated read all" on public.tasks          for select using (auth.role() = 'authenticated');
create policy "authenticated read all" on public.documents      for select using (auth.role() = 'authenticated');
create policy "authenticated read all" on public.quality_issues for select using (auth.role() = 'authenticated');
create policy "authenticated read all" on public.plugins        for select using (auth.role() = 'authenticated');
create policy "authenticated read all" on public.activity       for select using (auth.role() = 'authenticated');

-- Cho phép user đã xác thực ghi (admin/lead sẽ kiểm soát thêm ở app level)
create policy "authenticated insert" on public.tasks          for insert with check (auth.role() = 'authenticated');
create policy "authenticated update" on public.tasks          for update using (auth.role() = 'authenticated');
create policy "authenticated insert" on public.quality_issues for insert with check (auth.role() = 'authenticated');
create policy "authenticated update" on public.quality_issues for update using (auth.role() = 'authenticated');
create policy "authenticated insert" on public.documents      for insert with check (auth.role() = 'authenticated');
create policy "authenticated update" on public.activity       for insert with check (auth.role() = 'authenticated');
create policy "authenticated insert" on public.activity       for insert with check (auth.role() = 'authenticated');
create policy "authenticated update" on public.plugins        for update using (auth.role() = 'authenticated');

-- ============================================================
-- FUNCTION: tự cập nhật online status khi login/logout
-- ============================================================
create or replace function public.handle_user_online()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.users set online = true where id = new.user_id;
  elsif tg_op = 'DELETE' then
    update public.users set online = false where id = old.user_id;
  end if;
  return null;
end;
$$;

-- ============================================================
-- SEED DATA (tùy chọn — dữ liệu mẫu để test)
-- Chạy SAU KHI đã tạo user thật qua Auth → Users
-- ============================================================
-- insert into public.projects (name, code, status, progress, deadline, phase, tasks, done)
-- values ('Nhà Máy Thép Bình Dương', 'BD-2024-01', 'active', 68, '2024-08-15', 'Thiết kế chi tiết', 24, 16);
