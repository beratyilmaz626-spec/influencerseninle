/*
  # Fix RLS policies for users table

  1. Security Updates
    - Drop existing restrictive policies
    - Create proper policies for authenticated users to manage their own profiles
    - Allow INSERT operations for new user profile creation
    - Allow SELECT operations for users to read their own data
    - Allow UPDATE operations for profile updates
    - Allow DELETE operations for account deletion

  2. Policy Details
    - All policies use `auth.uid() = id` to ensure users can only access their own data
    - Policies target the `authenticated` role
    - INSERT policy allows profile creation during signup
    - SELECT policy allows profile reading
    - UPDATE policy allows profile modifications
    - DELETE policy allows account deletion
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;

-- Create comprehensive RLS policies for the users table
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

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

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;