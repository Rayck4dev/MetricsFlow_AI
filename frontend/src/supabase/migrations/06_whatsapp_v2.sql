-- MetricsFlow AI - V2 WhatsApp + IA
-- Execute depois dos scripts 01..05 existentes.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'whatsapp_connection_status') THEN
    CREATE TYPE public.whatsapp_connection_status AS ENUM ('pending', 'verified', 'disabled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'whatsapp_direction') THEN
    CREATE TYPE public.whatsapp_direction AS ENUM ('inbound', 'outbound');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'whatsapp_message_type') THEN
    CREATE TYPE public.whatsapp_message_type AS ENUM ('text', 'audio');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pending_transaction_status') THEN
    CREATE TYPE public.pending_transaction_status AS ENUM (
      'awaiting_information',
      'awaiting_confirmation',
      'confirmed',
      'cancelled',
      'expired'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.whatsapp_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  phone_number varchar(30) NOT NULL UNIQUE,
  status public.whatsapp_connection_status NOT NULL DEFAULT 'pending',
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_message_id varchar(255) NOT NULL UNIQUE,
  phone_number varchar(30) NOT NULL,
  direction public.whatsapp_direction NOT NULL,
  message_type public.whatsapp_message_type NOT NULL,
  message_text text,
  provider_media_id varchar(255),
  transcription text,
  status public.whatsapp_message_status NOT NULL DEFAULT 'pending',
  pending_transaction_id uuid,
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  provider_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pending_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_message_id uuid REFERENCES public.whatsapp_messages(id) ON DELETE SET NULL,
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  type public.transaction_type,
  amount numeric(15, 2) CHECK (amount IS NULL OR amount > 0),
  description varchar(255),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name varchar(100),
  payment_method public.payment_method,
  transaction_date date,
  raw_message text NOT NULL,
  confidence numeric(4, 3) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  missing_fields text[] NOT NULL DEFAULT '{}',
  status public.pending_transaction_status NOT NULL DEFAULT 'awaiting_information',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'whatsapp_messages_pending_transaction_id_fkey'
  ) THEN
    ALTER TABLE public.whatsapp_messages
      ADD CONSTRAINT whatsapp_messages_pending_transaction_id_fkey
      FOREIGN KEY (pending_transaction_id)
      REFERENCES public.pending_transactions(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_whatsapp_connections_company ON public.whatsapp_connections(company_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_company_created ON public.whatsapp_messages(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_transactions_user_status ON public.pending_transactions(user_id, company_id, status, created_at DESC);

ALTER TABLE public.whatsapp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_whatsapp_connections" ON public.whatsapp_connections;
DROP POLICY IF EXISTS "users_manage_own_whatsapp_connection" ON public.whatsapp_connections;
CREATE POLICY "members_select_whatsapp_connections"
ON public.whatsapp_connections FOR SELECT TO authenticated
USING (public.is_company_member(company_id));
CREATE POLICY "users_manage_own_whatsapp_connection"
ON public.whatsapp_connections FOR ALL TO authenticated
USING (user_id = auth.uid() AND public.is_company_member(company_id))
WITH CHECK (user_id = auth.uid() AND public.is_company_member(company_id));

DROP POLICY IF EXISTS "members_select_whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "members_select_whatsapp_messages"
ON public.whatsapp_messages FOR SELECT TO authenticated
USING (public.is_company_member(company_id));

DROP POLICY IF EXISTS "members_select_pending_transactions" ON public.pending_transactions;
DROP POLICY IF EXISTS "users_manage_own_pending_transactions" ON public.pending_transactions;
CREATE POLICY "members_select_pending_transactions"
ON public.pending_transactions FOR SELECT TO authenticated
USING (public.is_company_member(company_id));
CREATE POLICY "users_manage_own_pending_transactions"
ON public.pending_transactions FOR ALL TO authenticated
USING (user_id = auth.uid() AND public.is_company_member(company_id))
WITH CHECK (user_id = auth.uid() AND public.is_company_member(company_id));

-- Corrige o gap identificado na V1: UPDATE/DELETE de transactions passam a ser owner-only.
DROP POLICY IF EXISTS "members_update_transactions" ON public.transactions;
DROP POLICY IF EXISTS "members_delete_transactions" ON public.transactions;
CREATE POLICY "owners_update_transactions"
ON public.transactions FOR UPDATE TO authenticated
USING (public.is_company_owner(company_id))
WITH CHECK (public.is_company_owner(company_id));
CREATE POLICY "owners_delete_transactions"
ON public.transactions FOR DELETE TO authenticated
USING (public.is_company_owner(company_id));
