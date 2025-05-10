/*
  # Create test user account
  
  1. Create User
    - Email: test@example.com
    - Password: password123
    - Name: Test User
  
  2. Security
    - Uses secure password hashing
    - Creates corresponding profile entry
*/

-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert test user into auth.users
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'test@example.com',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test User"}',
    'authenticated',
    'authenticated',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    ''
  )
  RETURNING id INTO test_user_id;

  -- Create profile for the test user
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    created_at,
    updated_at
  ) VALUES (
    test_user_id,
    'test@example.com',
    'Test User',
    NOW(),
    NOW()
  );
END $$;