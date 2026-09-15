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