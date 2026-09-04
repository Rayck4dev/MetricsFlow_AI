-- MetricsFlow AI
-- Supabase / PostgreSQL

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'user_role'
        AND typnamespace = 'public'::regnamespace
    ) THEN
        CREATE TYPE public.user_role AS ENUM ('owner', 'collaborator');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'transaction_type'
        AND typnamespace = 'public'::regnamespace
    ) THEN
        CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'payment_method'
        AND typnamespace = 'public'::regnamespace
    ) THEN
        CREATE TYPE public.payment_method AS ENUM (
            'pix',
            'credit_card',
            'debit_card',
            'bank_slip',
            'cash',
            'transfer',
            'other'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'whatsapp_message_status'
        AND typnamespace = 'public'::regnamespace
    ) THEN
        CREATE TYPE public.whatsapp_message_status AS ENUM (
            'pending',
            'processed',
            'failed'
        );
    END IF;
END
$$;
