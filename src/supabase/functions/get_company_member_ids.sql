-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

