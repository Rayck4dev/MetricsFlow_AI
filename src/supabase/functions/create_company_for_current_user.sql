-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

