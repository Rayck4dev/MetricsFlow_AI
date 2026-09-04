-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

