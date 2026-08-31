-- MetricsFlow AI
-- Função fornecida no schema do projeto.

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

