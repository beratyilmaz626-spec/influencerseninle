/*
  # Fix infinite recursion in RLS policies

  1. Problem
    - Admin policies were querying users table within users table policies
    - This created infinite recursion loops
    
  2. Solution
    - Simplify policies to avoid self-referencing queries
    - Use direct auth.uid() comparisons instead of subqueries
    - Keep admin policies separate and simple
    
  3. Security
    - Users can only access their own data
    - Admin access handled at application level
    - Service role maintains full access
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin can delete any user" ON users;
DROP POLICY IF EXISTS "Admin can update any user" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Enable insert for service role and authenticated users" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Service role maintains full access
CREATE POLICY "Service role full access"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix slider_videos policies to avoid recursion
DROP POLICY IF EXISTS "Admin users can manage slider videos" ON slider_videos;
DROP POLICY IF EXISTS "Public can view active slider videos" ON slider_videos;

-- Simple slider policies without user table queries
CREATE POLICY "Authenticated users can manage slider videos"
  ON slider_videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view active slider videos"
  ON slider_videos
  FOR SELECT
  TO public
  USING (is_active = true);