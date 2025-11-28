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