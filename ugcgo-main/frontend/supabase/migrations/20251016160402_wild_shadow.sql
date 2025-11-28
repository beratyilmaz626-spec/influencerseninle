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