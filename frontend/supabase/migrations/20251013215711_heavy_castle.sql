/*
  # Add Admin System

  1. New Tables
    - Add `is_admin` column to users table
    - Set ogun.karabulut@hotmail.com as admin
  
  2. Security
    - Update RLS policies for admin-only access
    - Restrict slider_videos and user management to admins
*/

-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Set ogun.karabulut@hotmail.com as admin
UPDATE users SET is_admin = true WHERE email = 'ogun.karabulut@hotmail.com';

-- If user doesn't exist, create admin user (this will be handled by auth trigger)
-- The user will be created when they first sign up

-- Update slider_videos policies to be admin-only
DROP POLICY IF EXISTS "Authenticated users can manage slider videos" ON slider_videos;
DROP POLICY IF EXISTS "Public can view active slider videos" ON slider_videos;

-- Admin-only management policy
CREATE POLICY "Admin users can manage slider videos"
  ON slider_videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Public can still view active slider videos
CREATE POLICY "Public can view active slider videos"
  ON slider_videos
  FOR SELECT
  TO public
  USING (is_active = true);

-- Update users table policies for admin access
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;

-- Users can view own profile
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admin can view all users
CREATE POLICY "Admin can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can update any user
CREATE POLICY "Admin can update any user"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Users can delete own profile
CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Admin can delete any user
CREATE POLICY "Admin can delete any user"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );