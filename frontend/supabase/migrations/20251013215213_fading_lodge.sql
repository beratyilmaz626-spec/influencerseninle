/*
  # Create slider videos table for manual video management

  1. New Tables
    - `slider_videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `video_url` (text)
      - `thumbnail_url` (text, optional)
      - `order_index` (integer for sorting)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `slider_videos` table
    - Add policy for public read access
    - Add policy for authenticated users to manage
*/

CREATE TABLE IF NOT EXISTS slider_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE slider_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active slider videos
CREATE POLICY "Public can view active slider videos"
  ON slider_videos
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to manage slider videos
CREATE POLICY "Authenticated users can manage slider videos"
  ON slider_videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS slider_videos_order_idx ON slider_videos (order_index ASC, created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_slider_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_slider_videos_updated_at
  BEFORE UPDATE ON slider_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_slider_videos_updated_at();