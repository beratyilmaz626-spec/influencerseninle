/*
  # Fix RLS policies for videos table

  1. Security Updates
    - Drop existing restrictive policies
    - Create new policies that allow users to see all videos
    - Maintain security while allowing proper access

  2. Policy Changes
    - Allow authenticated users to view all videos
    - Allow users to manage their own videos
    - Allow service role full access for webhooks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own videos" ON videos;
DROP POLICY IF EXISTS "Users can insert their own videos" ON videos;
DROP POLICY IF EXISTS "Users can update their own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete their own videos" ON videos;

-- Create new policies that allow viewing all videos
CREATE POLICY "Authenticated users can view all videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert videos (for manual creation)
CREATE POLICY "Authenticated users can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own videos
CREATE POLICY "Users can update their own videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete their own videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow service role full access (for webhooks)
CREATE POLICY "Service role full access"
  ON videos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);