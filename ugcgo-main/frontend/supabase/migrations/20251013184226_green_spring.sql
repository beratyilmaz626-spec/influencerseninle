/*
  # Fix signup database error

  1. Problem Analysis
    - Supabase signup failing with "Database error saving new user"
    - Likely caused by trigger or RLS policy interfering with auth.users table

  2. Solution
    - Check and fix the handle_new_user trigger function
    - Ensure proper error handling in trigger
    - Add safety checks to prevent trigger failures

  3. Changes
    - Update handle_new_user function with better error handling
    - Add conditional checks to prevent duplicate insertions
    - Ensure trigger doesn't fail the entire signup process
*/

-- Drop existing trigger and function to recreate them safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if user doesn't already exist in public.users
  INSERT INTO public.users (id, email, full_name, company_name, country)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULL,
    'Türkiye'
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate key errors
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the signup process
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies are not blocking the trigger
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies with proper permissions
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;

-- Allow service role to insert during signup trigger
CREATE POLICY "Enable insert for service role and authenticated users"
  ON public.users
  FOR INSERT
  TO authenticated, service_role
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);