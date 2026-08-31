-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

