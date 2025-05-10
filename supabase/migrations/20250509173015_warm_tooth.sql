/*
  # Create test user account with proper cleanup
  
  1. Changes
    - Safely removes existing test user and profile
    - Creates new test user with proper UUID
    - Creates corresponding profile entry
  
  2. Security
    - Uses secure password hashing
    - Handles all required fields
*/

-- First remove the test user if it exists
DO $$ 
BEGIN
  -- Delete profile first due to foreign key constraint
  DELETE FROM public.profiles WHERE email = 'test@example.com';
  -- Then delete the user
  DELETE FROM auth.users WHERE email = 'test@example.com';
EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;

-- Create test user in auth.users
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate new UUID for the user
  SELECT gen_random_uuid() INTO new_user_id;

  -- Create the user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    confirmation_token,
    recovery_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test User"}',
    'authenticated',
    'authenticated',
    '',
    ''
  );

  -- Create corresponding profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'test@example.com',
    'Test User',
    now(),
    now()
  );

EXCEPTION
  WHEN unique_violation THEN
    -- If we hit a unique constraint, just ignore it
    NULL;
END $$;