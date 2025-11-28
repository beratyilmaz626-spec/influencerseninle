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