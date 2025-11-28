/*
  # Add User Profile Function

  1. New Function
    - get_user_profile: Safe way to get user profile without RLS recursion
    - Uses security definer to bypass RLS safely
    - Only returns user's own profile or admin data

  2. Security
    - Function runs with definer rights (bypasses RLS)
    - Still maintains security by checking auth.uid()
    - Safe for admin operations
*/

CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  company_name text,
  country text,
  created_at timestamptz,
  updated_at timestamptz,
  is_admin boolean
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only allow users to get their own profile
  IF auth.uid() != user_id THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.company_name,
    u.country,
    u.created_at,
    u.updated_at,
    u.is_admin
  FROM users u
  WHERE u.id = user_id;
END;
$$;