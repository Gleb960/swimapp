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

-- Create test user in auth.users
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
  role
) VALUES (
  gen_random_uuid(),
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
);

-- Create profile for the test user
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  created_at,
  updated_at
FROM auth.users
WHERE email = 'test@example.com';