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