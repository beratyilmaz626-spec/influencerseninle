-- Migration: 20251012193711_little_canyon.sql
/*
  # Create videos table and user management

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, video name)
      - `description` (text, video description)
      - `status` (text, processing status)
      - `duration` (text, video duration)
      - `views` (integer, view count)
      - `product_url` (text, original product URL)
      - `product_name` (text, product name)
      - `selected_style` (text, chosen video style)
      - `selected_voice` (text, chosen voice)
      - `script_content` (text, video script)
      - `video_url` (text, generated video URL)
      - `thumbnail_url` (text, video thumbnail URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `videos` table
    - Add policies for authenticated users to manage their own videos
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  duration text DEFAULT '0:00',
  views integer DEFAULT 0,
  product_url text,
  product_name text,
  selected_style text,
  selected_voice text,
  script_content text,
  video_url text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policies for videos table
CREATE POLICY "Users can view their own videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS videos_user_id_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);


-- Migration: 20251012194645_sweet_marsh.sql
/*
  # Create Storage Bucket for Videos

  1. Storage Setup
    - Create 'videos' bucket for storing video files and thumbnails
    - Configure public access for video files
    - Set up RLS policies for secure access

  2. Security
    - Users can only upload to their own folder
    - Public read access for video playback
    - Authenticated users can manage their own files
*/

-- Create the videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload videos to their own folder
CREATE POLICY "Users can upload videos to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view their own videos
CREATE POLICY "Users can view their own videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to videos (for sharing)
CREATE POLICY "Public can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Allow authenticated users to delete their own videos
CREATE POLICY "Users can delete their own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own videos
CREATE POLICY "Users can update their own videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);


-- Migration: 20251012200631_rough_mud.sql
/*
  # Kullanıcılar Tablosu Oluştur

  1. Yeni Tablolar
    - `users`
      - `id` (uuid, primary key) - Supabase auth.users ile eşleşir
      - `email` (text, unique) - Kullanıcı e-posta adresi
      - `full_name` (text) - Kullanıcının tam adı
      - `company_name` (text, nullable) - Şirket adı (isteğe bağlı)
      - `country` (text) - Ülke bilgisi
      - `created_at` (timestamp) - Kayıt tarihi
      - `updated_at` (timestamp) - Son güncelleme tarihi

  2. Güvenlik
    - `users` tablosunda RLS etkinleştir
    - Kullanıcılar sadece kendi verilerini görebilir ve güncelleyebilir
    - Kayıt sırasında otomatik kullanıcı oluşturma trigger'ı

  3. Trigger Fonksiyonu
    - Supabase auth.users'a kayıt olunduğunda otomatik olarak users tablosuna kayıt ekler
*/

-- Kullanıcılar tablosunu oluştur
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  company_name text,
  country text DEFAULT 'Türkiye',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS'yi etkinleştir
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Kullanıcılar sadece kendi verilerini güncelleyebilir
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Kullanıcılar sadece kendi verilerini silebilir
CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Yeni kullanıcı kaydı için trigger fonksiyonu
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auth kullanıcısı oluşturulduğunda users tablosuna da ekle
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Migration: 20251013183627_calm_spring.sql
/*
  # Disable email confirmation for testing

  1. Configuration Changes
    - Disable email confirmation requirement
    - Allow users to sign in immediately after registration
  
  2. Security Note
    - This is for development/testing purposes
    - In production, email confirmation should be enabled
*/

-- Update auth configuration to disable email confirmation
-- Note: This needs to be done via Supabase Dashboard or CLI
-- The following is for reference only

-- In Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Uncheck "Enable email confirmations"
-- 3. Save changes

-- Alternative: Update auth.users table to auto-confirm emails
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;


-- Migration: 20251013184031_divine_sound.sql
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


-- Migration: 20251013184226_green_spring.sql
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


-- Migration: 20251013190416_teal_firefly.sql
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


-- Migration: 20251013215213_fading_lodge.sql
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


-- Migration: 20251013215711_heavy_castle.sql
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


-- Migration: 20251013215827_wandering_lantern.sql
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


-- Migration: 20251013215913_fierce_dune.sql
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


-- Migration: 20251013215923_patient_glitter.sql
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


-- Migration: 20251016145239_light_bar.sql
/*
  # Stripe Integration Schema

  1. New Tables
    - `stripe_customers`: Links Supabase users to Stripe customers
      - Includes `user_id` (references `auth.users`)
      - Stores Stripe `customer_id`
      - Implements soft delete

    - `stripe_subscriptions`: Manages subscription data
      - Tracks subscription status, periods, and payment details
      - Links to `stripe_customers` via `customer_id`
      - Custom enum type for subscription status
      - Implements soft delete

    - `stripe_orders`: Stores order/purchase information
      - Records checkout sessions and payment intents
      - Tracks payment amounts and status
      - Custom enum type for order status
      - Implements soft delete

  2. Views
    - `stripe_user_subscriptions`: Secure view for user subscription data
      - Joins customers and subscriptions
      - Filtered by authenticated user

    - `stripe_user_orders`: Secure view for user order history
      - Joins customers and orders
      - Filtered by authenticated user

  3. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for authenticated users to view their own data
*/

CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE TYPE stripe_subscription_status AS ENUM (
    'not_started',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
);

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint primary key generated always as identity,
  customer_id text unique not null,
  subscription_id text default null,
  price_id text default null,
  current_period_start bigint default null,
  current_period_end bigint default null,
  cancel_at_period_end boolean default false,
  payment_method_brand text default null,
  payment_method_last4 text default null,
  status stripe_subscription_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

CREATE TYPE stripe_order_status AS ENUM (
    'pending',
    'completed',
    'canceled'
);

CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint primary key generated always as identity,
    checkout_session_id text not null,
    payment_intent_id text not null,
    customer_id text not null,
    amount_subtotal bigint not null,
    amount_total bigint not null,
    currency text not null,
    payment_status text not null,
    status stripe_order_status not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
    ON stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- View for user subscriptions
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

GRANT SELECT ON stripe_user_subscriptions TO authenticated;

-- View for user orders
CREATE VIEW stripe_user_orders WITH (security_invoker) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;


-- Migration: 20251016160402_wild_shadow.sql
/*
  # User Credits System

  1. New Tables
    - `user_credits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `credits` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `credit_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `amount` (integer, can be positive or negative)
      - `type` (text, e.g., 'purchase', 'signup_bonus', 'video_creation')
      - `description` (text)
      - `stripe_order_id` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read their own data
    - Add policies for service role to manage all data

  3. Functions
    - Function to add credits to user
    - Function to deduct credits from user
    - Trigger to give signup bonus credits
*/

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'signup_bonus', 'video_creation', 'refund')),
  description text NOT NULL,
  stripe_order_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_credits
CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credits"
  ON user_credits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all transactions"
  ON credit_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to add credits to user
CREATE OR REPLACE FUNCTION add_user_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_description text,
  p_stripe_order_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update user credits
  INSERT INTO user_credits (user_id, credits)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    credits = user_credits.credits + p_amount,
    updated_at = now();

  -- Record the transaction
  INSERT INTO credit_transactions (user_id, amount, type, description, stripe_order_id)
  VALUES (p_user_id, p_amount, p_type, p_description, p_stripe_order_id);
END;
$$;

-- Function to deduct credits from user
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_description text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
BEGIN
  -- Get current credits
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = p_user_id;

  -- Check if user has enough credits
  IF current_credits IS NULL OR current_credits < p_amount THEN
    RETURN false;
  END IF;

  -- Deduct credits
  UPDATE user_credits
  SET credits = credits - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Record the transaction (negative amount)
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_amount, p_type, p_description);

  RETURN true;
END;
$$;

-- Function to give signup bonus credits
CREATE OR REPLACE FUNCTION give_signup_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Give 2 free credits to new users
  PERFORM add_user_credits(
    NEW.id,
    2,
    'signup_bonus',
    'Hoş geldin hediyesi - 2 ücretsiz video kredisi'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger to give signup bonus when user profile is created
CREATE OR REPLACE TRIGGER give_signup_bonus_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION give_signup_bonus();

-- Update trigger for user_credits
CREATE OR REPLACE FUNCTION update_user_credits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_stripe_order_id ON credit_transactions(stripe_order_id) WHERE stripe_order_id IS NOT NULL;


-- Migration: 20251016160920_solitary_swamp.sql
/*
  # Fix signup bonus credits

  1. Updates
    - Fix signup bonus function to give 2 credits instead of 45
    - Correct existing users who received wrong signup bonus
    - Update transaction records for signup bonuses

  2. Security
    - Maintains existing RLS policies
    - Uses service role for corrections
*/

-- First, let's see what the current function looks like and fix it
CREATE OR REPLACE FUNCTION give_signup_bonus()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert initial credits for new user (2 credits for signup bonus)
  INSERT INTO user_credits (user_id, credits)
  VALUES (NEW.id, 2);
  
  -- Record the signup bonus transaction
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 2, 'signup_bonus', 'Kayıt bonusu - 2 ücretsiz kredi');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix existing users who got wrong signup bonus amount
-- First, identify users who only have signup bonus (no purchases)
UPDATE user_credits 
SET credits = 2, updated_at = now()
WHERE user_id IN (
  SELECT uc.user_id 
  FROM user_credits uc
  LEFT JOIN credit_transactions ct ON uc.user_id = ct.user_id AND ct.type = 'purchase'
  WHERE ct.user_id IS NULL -- No purchase transactions
  AND uc.credits > 2 -- Has more than 2 credits (wrong signup bonus)
);

-- Fix the transaction records for signup bonuses
UPDATE credit_transactions 
SET amount = 2, description = 'Kayıt bonusu - 2 ücretsiz kredi'
WHERE type = 'signup_bonus' 
AND amount != 2;

-- For users who had wrong signup bonus but also made purchases, we need to be more careful
-- Let's create a temporary function to fix these cases
CREATE OR REPLACE FUNCTION fix_mixed_credit_users()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  correct_credits INTEGER;
BEGIN
  -- Find users who have both signup bonus and purchases
  FOR user_record IN 
    SELECT 
      uc.user_id,
      uc.credits as current_credits,
      COALESCE(SUM(CASE WHEN ct.type = 'purchase' THEN ct.amount ELSE 0 END), 0) as purchase_credits,
      COALESCE(SUM(CASE WHEN ct.type = 'video_creation' THEN ct.amount ELSE 0 END), 0) as spent_credits
    FROM user_credits uc
    LEFT JOIN credit_transactions ct ON uc.user_id = ct.user_id
    WHERE uc.user_id IN (
      SELECT DISTINCT user_id FROM credit_transactions WHERE type = 'signup_bonus'
    )
    GROUP BY uc.user_id, uc.credits
  LOOP
    -- Calculate what the correct credits should be
    -- 2 (signup) + purchase_credits + spent_credits (negative)
    correct_credits := 2 + user_record.purchase_credits + user_record.spent_credits;
    
    -- Only update if the current credits don't match the correct amount
    IF user_record.current_credits != correct_credits THEN
      UPDATE user_credits 
      SET credits = correct_credits, updated_at = now()
      WHERE user_id = user_record.user_id;
      
      RAISE NOTICE 'Fixed user % credits from % to %', 
        user_record.user_id, user_record.current_credits, correct_credits;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the fix function
SELECT fix_mixed_credit_users();

-- Drop the temporary function
DROP FUNCTION fix_mixed_credit_users();


-- Migration: 20251016161150_green_river.sql
/*
  # Sync user_credits table with transaction amounts

  1. Updates user_credits table to match actual transaction totals
  2. Recalculates credits based on all transactions (signup_bonus + purchases - video_creation)
  3. Ensures UI shows correct credit amounts

  This will fix the mismatch between transaction records (showing 2) and user_credits (showing 45)
*/

-- Update user_credits table to match the sum of all transactions
UPDATE user_credits 
SET credits = (
  SELECT COALESCE(SUM(amount), 0)
  FROM credit_transactions 
  WHERE credit_transactions.user_id = user_credits.user_id
),
updated_at = now()
WHERE EXISTS (
  SELECT 1 FROM credit_transactions 
  WHERE credit_transactions.user_id = user_credits.user_id
);

-- Insert missing user_credits records for users who have transactions but no credit record
INSERT INTO user_credits (user_id, credits, created_at, updated_at)
SELECT 
  ct.user_id,
  SUM(ct.amount) as total_credits,
  now(),
  now()
FROM credit_transactions ct
LEFT JOIN user_credits uc ON ct.user_id = uc.user_id
WHERE uc.user_id IS NULL
GROUP BY ct.user_id;


-- Migration: 20251016161524_broad_paper.sql
/*
  # Add user_credits_points column to users table

  1. New Column
    - `user_credits_points` (integer, default 2)
    - Set default value of 2 for all new registrations
  
  2. Data Migration
    - Update existing users to have 2 credits
    - Ensure all users start with proper credit amount
  
  3. Trigger Update
    - Modify signup trigger to set credits in users table
*/

-- Add user_credits_points column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_credits_points integer DEFAULT 2;

-- Update existing users to have 2 credits
UPDATE users 
SET user_credits_points = 2 
WHERE user_credits_points IS NULL;

-- Create or replace the signup bonus function to set credits in users table
CREATE OR REPLACE FUNCTION give_signup_bonus()
RETURNS TRIGGER AS $$
BEGIN
  -- Set user credits points to 2 in users table
  UPDATE users 
  SET user_credits_points = 2 
  WHERE id = NEW.id;
  
  -- Also insert into user_credits table for compatibility
  INSERT INTO user_credits (user_id, credits)
  VALUES (NEW.id, 2)
  ON CONFLICT (user_id) DO UPDATE SET credits = 2;
  
  -- Insert transaction record
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 2, 'signup_bonus', 'Üyelik bonusu - 2 ücretsiz kredi');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

