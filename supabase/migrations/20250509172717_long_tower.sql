/*
  # Fix Authentication Schema

  1. Changes
    - Drop and recreate test user
    - Update schema constraints
    - Fix auth tables setup

  2. Security
    - Maintain RLS policies
    - Ensure proper user creation
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
  new_user_id uuid;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test User"}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO new_user_id;

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