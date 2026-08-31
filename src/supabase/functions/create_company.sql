-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

