/*
  # Fix profiles table foreign key constraint

  1. Changes
    - Remove existing foreign key if it exists
    - Update profiles table to use UUID from auth.users
    - Add proper RLS policies
*/

-- Update profiles table
DO $$ 
BEGIN
  -- Remove existing foreign key if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles 
    DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Update or create RLS policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);