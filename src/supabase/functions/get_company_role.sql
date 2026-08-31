-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

