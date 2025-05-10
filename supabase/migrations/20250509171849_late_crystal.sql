/*
  # Create test user if not exists
  
  1. Changes
    - Check if user exists before creating
    - Use DO block for conditional logic
    - Handle profile creation
  
  2. Security
    - Uses secure password hashing
    - Maintains proper user metadata
*/

DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'test@example.com'
  ) THEN
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
      now(),
      now()
    );
  END IF;
END $$;