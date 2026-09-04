-- MetricsFlow AI
-- Supabase / PostgreSQL
-- Funções enviadas pelo projeto, organizadas na mesma ordem apresentada.

CREATE OR REPLACE FUNCTION public.check_is_company_owner(co_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM company_members
    WHERE user_id = auth.uid()
      AND company_id = co_id
      AND role = 'owner'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_company(
  company_name character varying,
  company_document character varying,
  company_phone character varying
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_company_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Usuário não autenticado.'
    );
  END IF;

  IF company_name IS NULL OR trim(company_name) = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'O nome da empresa é obrigatório.'
    );
  END IF;

  INSERT INTO companies (name, document, phone_number)
  VALUES (
    trim(company_name),
    NULLIF(trim(company_document), ''),
    NULLIF(trim(company_phone), '')
  )
  RETURNING id INTO new_company_id;

  INSERT INTO company_members (company_id, user_id, role)
  VALUES (new_company_id, auth.uid(), 'owner');

  RETURN jsonb_build_object(
    'success', true,
    'company_id', new_company_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_company_for_current_user(company_name_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  existing_company_id uuid;
  new_company_id uuid;
  clean_company_name text;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Usuário não autenticado.');
  END IF;

  clean_company_name := trim(company_name_input);

  IF clean_company_name IS NULL OR clean_company_name = '' THEN
    RETURN jsonb_build_object('success', false, 'message', 'O nome da empresa é obrigatório.');
  END IF;

  SELECT cm.company_id
  INTO existing_company_id
  FROM public.company_members cm
  WHERE cm.user_id = current_user_id
    AND cm.role = 'owner'::public.user_role
  LIMIT 1;

  IF existing_company_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_exists', true,
      'company_id', existing_company_id,
      'role', 'owner'
    );
  END IF;

  INSERT INTO public.companies (name)
  VALUES (clean_company_name)
  RETURNING id INTO new_company_id;

  INSERT INTO public.company_members (company_id, user_id, role)
  VALUES (new_company_id, current_user_id, 'owner'::public.user_role);

  RETURN jsonb_build_object(
    'success', true,
    'already_exists', false,
    'company_id', new_company_id,
    'company_name', clean_company_name,
    'role', 'owner'
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM,
      'error_code', SQLSTATE
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.debug_create_company_context()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_email text;
  profile_exists boolean;
  membership_exists boolean;
BEGIN
  current_user_id := auth.uid();

  SELECT email INTO current_email
  FROM auth.users
  WHERE id = current_user_id;

  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = current_user_id
  ) INTO profile_exists;

  SELECT EXISTS (
    SELECT 1 FROM company_members WHERE user_id = current_user_id
  ) INTO membership_exists;

  RETURN jsonb_build_object(
    'auth_uid', current_user_id,
    'email', current_email,
    'profile_exists', profile_exists,
    'membership_exists', membership_exists
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_company_member_ids()
RETURNS TABLE(member_user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT user_id
  FROM company_members
  WHERE company_id IN (
    SELECT company_id
    FROM company_members
    WHERE user_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_company_role(target_company_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role
  INTO user_role
  FROM public.company_members
  WHERE company_id = target_company_id
    AND user_id = auth.uid();

  RETURN user_role;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_companies()
RETURNS TABLE(company_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT company_id
  FROM company_members
  WHERE user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_company_ids()
RETURNS SETOF uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT company_id
  FROM company_members
  WHERE user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_company_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO categories (company_id, name, type, color, is_default)
  VALUES
    (NEW.id, 'Vendas / Produtos', 'income', '#10B981', TRUE),
    (NEW.id, 'Prestação de Serviços', 'income', '#06B6D4', TRUE),
    (NEW.id, 'Outras Receitas', 'income', '#64748B', TRUE),
    (NEW.id, 'Fornecedores / Estoque', 'expense', '#F43F5E', TRUE),
    (NEW.id, 'Aluguel / Água / Luz', 'expense', '#EF4444', TRUE),
    (NEW.id, 'Marketing / Anúncios', 'expense', '#F97316', TRUE),
    (NEW.id, 'DAS / Impostos MEI', 'expense', '#A855F7', TRUE),
    (NEW.id, 'Ferramentas / Sistema', 'expense', '#3B82F6', TRUE),
    (NEW.id, 'Outras Despesas', 'expense', '#64748B', TRUE);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_name text;
BEGIN
  user_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), '');

  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, user_name, NEW.email)
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_company_member(target_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_id = target_company_id
      AND user_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_company_owner(target_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_id = target_company_id
      AND user_id = auth.uid()
      AND role = 'owner'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.join_company_by_code(code_input character varying)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_company_id UUID;
  existing_membership UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Usuário não autenticado.');
  END IF;

  IF code_input IS NULL OR trim(code_input) = '' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Informe um código de convite.');
  END IF;

  SELECT id INTO target_company_id
  FROM companies
  WHERE UPPER(invite_code) = UPPER(trim(code_input));

  IF target_company_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Código de convite inválido.');
  END IF;

  SELECT id INTO existing_membership
  FROM company_members
  WHERE company_id = target_company_id
    AND user_id = auth.uid();

  IF existing_membership IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Usuário já pertence a esta empresa.',
      'company_id', target_company_id
    );
  END IF;

  INSERT INTO company_members (company_id, user_id, role)
  VALUES (target_company_id, auth.uid(), 'collaborator');

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Usuário adicionado à empresa.',
    'company_id', target_company_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
