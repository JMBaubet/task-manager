-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create projects table
create table public.projects (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamptz default now()
);

-- Create tasks table
create table public.tasks (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    description text,
    status text not null,
    priority integer default 3,
    created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Create policies (for now, allow public access if using anon key, or restrict if auth is implemented)
-- For this simple migration without explicit auth requirements, we will allow all operations for the anon role
-- WARNING: This means anyone with your anon key can read/write your data. 
-- For a production app, you should implement Authentication.
create policy "Enable all access for all users" on public.projects
for all using (true) with check (true);

create policy "Enable all access for all users" on public.tasks
for all using (true) with check (true);
