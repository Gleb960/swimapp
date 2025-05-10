/*
  # Create and seed lessons table
  
  1. Table Creation
    - Creates lessons table with necessary columns
    - Enables RLS
    - Adds policies for access control
  
  2. Initial Data
    - Seeds basic swimming lessons
    - Includes titles, descriptions, durations and thumbnails
*/

-- Create lessons table if it doesn't exist
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  duration integer NOT NULL,
  thumbnail_url text,
  video_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view lessons
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial lessons
INSERT INTO lessons (title, description, duration, thumbnail_url, video_url) VALUES
(
  'Основы дыхания и скольжения',
  'Научимся правильно дышать в воде и освоим базовые упражнения скольжения',
  30,
  'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
  'https://example.com/video1'
),
(
  'Работа ног',
  'Освоим технику работы ног при плавании кролем',
  30,
  'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
  'https://example.com/video2'
),
(
  'Скольжение на груди',
  'Техника скольжения на груди с работой ног',
  35,
  'https://images.pexels.com/photos/73760/swimming-swimmer-female-race-73760.jpeg',
  'https://example.com/video3'
),
(
  'Скольжение на спине',
  'Освоение техники скольжения на спине',
  35,
  'https://images.pexels.com/photos/260598/pexels-photo-260598.jpeg',
  'https://example.com/video4'
),
(
  'Работа ног кролем',
  'Техника работы ног при плавании кролем',
  40,
  'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
  'https://example.com/video5'
);