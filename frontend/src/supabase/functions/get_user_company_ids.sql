-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

