/*
  # Reset Users Table RLS Policies

  1. Security Changes
    - Drop all existing problematic policies on users table
    - Create simple, non-recursive policies
    - Ensure no circular dependencies

  2. New Simple Policies
    - Users can only read/update their own profile
    - Service role has full access
    - No complex subqueries that cause recursion
*/

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Admin can manage all users" ON users;

-- Create simple, safe policies
CREATE POLICY "users_select_own" 
  ON users 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own" 
  ON users 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" 
  ON users 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete_own" 
  ON users 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = id);

-- Service role full access (no recursion risk)
CREATE POLICY "service_role_all_users" 
  ON users 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);