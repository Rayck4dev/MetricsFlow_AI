-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

