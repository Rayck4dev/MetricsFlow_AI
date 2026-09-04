-- MetricsFlow AI
-- Supabase / PostgreSQL

-- ================================================================
-- CATEGORIES
-- ================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_categories" ON public.categories;
DROP POLICY IF EXISTS "members_insert_categories" ON public.categories;
DROP POLICY IF EXISTS "members_update_categories" ON public.categories;
DROP POLICY IF EXISTS "members_delete_categories" ON public.categories;

CREATE POLICY "members_select_categories"
ON public.categories
FOR SELECT
TO authenticated
USING (public.is_company_member(company_id));

CREATE POLICY "members_insert_categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.is_company_member(company_id));

CREATE POLICY "members_update_categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.is_company_member(company_id))
WITH CHECK (public.is_company_member(company_id));

CREATE POLICY "members_delete_categories"
ON public.categories
FOR DELETE
TO authenticated
USING (public.is_company_member(company_id));


-- ================================================================
-- COMPANIES
-- ================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_companies" ON public.companies;
DROP POLICY IF EXISTS "owner_update_companies" ON public.companies;
DROP POLICY IF EXISTS "authenticated_insert_companies" ON public.companies;

CREATE POLICY "members_select_companies"
ON public.companies
FOR SELECT
TO authenticated
USING (public.is_company_member(id));

CREATE POLICY "owner_update_companies"
ON public.companies
FOR UPDATE
TO authenticated
USING (public.is_company_owner(id))
WITH CHECK (public.is_company_owner(id));

CREATE POLICY "authenticated_insert_companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);


-- ================================================================
-- COMPANY MEMBERS
-- ================================================================
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_company_members" ON public.company_members;
DROP POLICY IF EXISTS "members_insert_company_members" ON public.company_members;
DROP POLICY IF EXISTS "owner_update_company_members" ON public.company_members;
DROP POLICY IF EXISTS "owner_or_self_delete_company_members" ON public.company_members;

CREATE POLICY "members_select_company_members"
ON public.company_members
FOR SELECT
TO authenticated
USING (public.is_company_member(company_id));

CREATE POLICY "members_insert_company_members"
ON public.company_members
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_owner(company_id)
  OR user_id = auth.uid()
);

CREATE POLICY "owner_update_company_members"
ON public.company_members
FOR UPDATE
TO authenticated
USING (public.is_company_owner(company_id))
WITH CHECK (public.is_company_owner(company_id));

CREATE POLICY "owner_or_self_delete_company_members"
ON public.company_members
FOR DELETE
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR user_id = auth.uid()
);


-- ================================================================
-- PROFILES
-- ================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "members_select_colleague_profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;

CREATE POLICY "users_select_own_profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "members_select_colleague_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (id IN (SELECT public.get_company_member_ids()));

CREATE POLICY "users_insert_own_profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own_profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- ================================================================
-- TRANSACTIONS
-- ================================================================
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_transactions" ON public.transactions;
DROP POLICY IF EXISTS "members_insert_transactions" ON public.transactions;
DROP POLICY IF EXISTS "members_update_transactions" ON public.transactions;
DROP POLICY IF EXISTS "members_delete_transactions" ON public.transactions;

CREATE POLICY "members_select_transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (public.is_company_member(company_id));

CREATE POLICY "members_insert_transactions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (public.is_company_member(company_id));

CREATE POLICY "members_update_transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (public.is_company_member(company_id))
WITH CHECK (public.is_company_member(company_id));

CREATE POLICY "members_delete_transactions"
ON public.transactions
FOR DELETE
TO authenticated
USING (public.is_company_member(company_id));


-- ================================================================
-- USER PREFERENCES
-- ================================================================
DO $$
BEGIN
  IF to_regclass('public.user_preferences') IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'user_preferences'
         AND column_name = 'user_id'
     ) THEN

    EXECUTE 'ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS "users_select_own_preferences" ON public.user_preferences';
    EXECUTE 'DROP POLICY IF EXISTS "users_update_own_preferences" ON public.user_preferences';

    EXECUTE '
      CREATE POLICY "users_select_own_preferences"
      ON public.user_preferences
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid())
    ';

    EXECUTE '
      CREATE POLICY "users_update_own_preferences"
      ON public.user_preferences
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid())
    ';
  END IF;
END;
$$;


-- ================================================================
-- WHATSAPP MESSAGES
-- ================================================================
DO $$
BEGIN
  IF to_regclass('public.whatsapp_messages') IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'whatsapp_messages'
         AND column_name = 'transaction_id'
     ) THEN

    EXECUTE 'ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS "owner_manage_whatsapp_messages" ON public.whatsapp_messages';
    EXECUTE 'DROP POLICY IF EXISTS "members_select_whatsapp_messages" ON public.whatsapp_messages';

    EXECUTE '
      CREATE POLICY "owner_manage_whatsapp_messages"
      ON public.whatsapp_messages
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.transactions t
          WHERE t.id = whatsapp_messages.transaction_id
            AND public.is_company_owner(t.company_id)
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.transactions t
          WHERE t.id = whatsapp_messages.transaction_id
            AND public.is_company_owner(t.company_id)
        )
      )
    ';

    EXECUTE '
      CREATE POLICY "members_select_whatsapp_messages"
      ON public.whatsapp_messages
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.transactions t
          WHERE t.id = whatsapp_messages.transaction_id
            AND public.is_company_member(t.company_id)
        )
      )
    ';
  END IF;
END;
$$;
