create table public.company_members (
  id uuid not null default gen_random_uuid (),
  company_id uuid not null,
  user_id uuid not null,
  role public.user_role not null default 'collaborator'::user_role,
  created_at timestamp with time zone null default now(),
  constraint company_members_pkey primary key (id),
  constraint company_members_company_id_user_id_key unique (company_id, user_id),
  constraint company_members_company_id_fkey foreign KEY (company_id) references companies (id) on delete CASCADE,
  constraint company_members_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_company_members_user on public.company_members using btree (user_id) TABLESPACE pg_default;
create index IF not exists idx_company_members_company on public.company_members using btree (company_id) TABLESPACE pg_default;

create unique INDEX IF not exists idx_one_owner_per_user on public.company_members using btree (user_id) TABLESPACE pg_default
where
  (role = 'owner'::user_role);
