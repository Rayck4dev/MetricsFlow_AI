create table public.transactions (
  id uuid not null default gen_random_uuid (),
  company_id uuid not null,
  category_id uuid null,
  created_by_user_id uuid null,
  type public.transaction_type not null,
  amount numeric(15, 2) not null,
  description character varying(255) not null,
  payment_method public.payment_method not null default 'pix'::payment_method,
  transaction_date date not null default CURRENT_DATE,
  origin character varying(50) null default 'web'::character varying,
  raw_whatsapp_text text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint transactions_pkey primary key (id),
  constraint transactions_category_id_fkey foreign KEY (category_id) references categories (id) on delete set null,
  constraint transactions_company_id_fkey foreign KEY (company_id) references companies (id) on delete CASCADE,
  constraint transactions_amount_check check ((amount > (0)::numeric))
) TABLESPACE pg_default;

create index IF not exists idx_transactions_company on public.transactions using btree (company_id) TABLESPACE pg_default;
create index IF not exists idx_transactions_date on public.transactions using btree (transaction_date) TABLESPACE pg_default;
create index IF not exists idx_transactions_type on public.transactions using btree (type) TABLESPACE pg_default;
create index IF not exists idx_transactions_category on public.transactions using btree (category_id) TABLESPACE pg_default;
create index IF not exists idx_transactions_created_by on public.transactions using btree (created_by_user_id) TABLESPACE pg_default;
