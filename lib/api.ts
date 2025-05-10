import { supabase } from './supabase';
import { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Training = Database['public']['Tables']['trainings']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];

export const api = {
  profiles: {
    get: async (): Promise<Profile | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, cannot fetch profile');
        return null;
      }

      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`*`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (data) {
          return data as Profile;
        }
        return null; 
      } catch (e) {
        console.error('Exception in api.profiles.get:', e);
        return null;
      }
    },
    update: async (updates: Partial<Profile>): Promise<Profile> => {
      const { data: authUserData, error: authError } = await supabase.auth.getUser();
      if (authError || !authUserData?.user) {
        console.error('User not authenticated for profile update (api.profiles.update):', authError);
        throw authError || new Error('User not authenticated for profile update.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authUserData.user.id) 
        .select('*') 
        .single();

      if (error) {
        console.error('Supabase error updating profile (api.profiles.update):', error);
        throw error;
      }
      if (!data) {
        throw new Error('Profile data not returned after update (api.profiles.update).');
      }
      return data as Profile;
    },
  },

  trainings: {
    list: async (): Promise<Training[]> => {
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
    add: async (training: Omit<Training, 'id' | 'user_id' | 'created_at'>): Promise<Training> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated to add training');
      const { data, error } = await supabase
        .from('trainings')
        .insert({
          ...training,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  achievements: {
    list: async (): Promise<Achievement[]> => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    unlock: async (type: string, value: string): Promise<Achievement> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated to unlock achievement');
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          type,
          value,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  lessons: {
    list: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    get: async (id: string): Promise<Lesson> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  },

  lessonProgress: {
    list: async (): Promise<LessonProgress[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated to list lesson progress');
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    complete: async (lessonId: string): Promise<LessonProgress> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated to complete lesson progress');
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          lesson_id: lessonId,
          user_id: user.id,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },
};

export { api };