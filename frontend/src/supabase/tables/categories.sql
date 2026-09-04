create table public.categories (
  id uuid not null default gen_random_uuid (),
  company_id uuid not null,
  name character varying(100) not null,
  type public.transaction_type not null,
  color character varying(7) null default '#3B82F6'::character varying,
  is_default boolean null default false,
  created_at timestamp with time zone null default now(),
  sort_order integer not null default 0,
  constraint categories_pkey primary key (id),
  constraint categories_company_id_name_type_key unique (company_id, name, type),
  constraint categories_company_id_fkey foreign KEY (company_id) references companies (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_categories_company on public.categories using btree (company_id) TABLESPACE pg_default;
create index IF not exists idx_categories_type on public.categories using btree (type) TABLESPACE pg_default;
