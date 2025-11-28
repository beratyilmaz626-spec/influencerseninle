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