-- MetricsFlow AI
-- Função fornecida no schema do projeto.

CREATE OR REPLACE FUNCTION public.debug_create_company_context()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  current_email text;
  profile_exists boolean;
  membership_exists boolean;
BEGIN
  current_user_id := auth.uid();

  SELECT email INTO current_email
  FROM auth.users
  WHERE id = current_user_id;

  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = current_user_id
  ) INTO profile_exists;

  SELECT EXISTS (
    SELECT 1 FROM company_members WHERE user_id = current_user_id
  ) INTO membership_exists;

  RETURN jsonb_build_object(
    'auth_uid', current_user_id,
    'email', current_email,
    'profile_exists', profile_exists,
    'membership_exists', membership_exists
  );
END;
$$;

