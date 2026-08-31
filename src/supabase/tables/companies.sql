create table public.companies (
  id uuid not null default gen_random_uuid (),
  name character varying(255) not null,
  document character varying(20) null,
  phone_number character varying(20) null,
  invite_code character varying(10) null default upper(
    SUBSTRING(
      md5((random())::text)
      from
        1 for 6
    )
  ),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint companies_pkey primary key (id),
  constraint companies_invite_code_key unique (invite_code)
) TABLESPACE pg_default;

create index IF not exists idx_companies_invite_code on public.companies using btree (invite_code) TABLESPACE pg_default;

create trigger trigger_seed_company_categories
after INSERT on companies for EACH row
execute FUNCTION handle_new_company_created ();
