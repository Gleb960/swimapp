/*
  # Create test user account
  
  1. Changes
    - Safely removes existing test user if present
    - Creates new test user with proper ID generation
    - Creates corresponding profile entry
    - Handles all required fields properly
  
  2. Security
    - Uses secure password hashing
    - Maintains referential integrity
*/

-- First remove the test user if it exists
DO $$ 
BEGIN
  DELETE FROM auth.users WHERE email = 'test@example.com';
  DELETE FROM public.profiles WHERE email = 'test@example.com';
EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;

-- Create test user in auth.users
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
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
    confirmation_token
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
    ''
  );

  -- Create profile for the test user
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
END $$;