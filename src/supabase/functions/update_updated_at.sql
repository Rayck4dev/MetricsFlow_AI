-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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
