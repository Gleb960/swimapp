import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signInWithPassword Error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Full signInWithEmail error object:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      // First, sign up the user with Supabase Auth
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        console.error('Supabase signUp Error:', signUpError);
        throw signUpError;
      }
      
      if (user) {
        // Create the profile using the user's ID from Auth
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: user.id,
              email: email,
              full_name: fullName,
            },
            { onConflict: 'id' }
          );

        if (profileError) {
          // If profile creation fails, we should clean up the auth user
          await supabase.auth.signOut();
          throw profileError;
        }
      }

      return user;
    } catch (error: any) {
      console.error('Full signUpWithEmail error object:', error);
      if (error?.message?.toLowerCase().includes('user already registered')) {
        throw new Error('Этот email уже зарегистрирован');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut Error:', error); // Corrected error message
        throw error;
      }
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting to reset password for email:', email); // Added for debugging
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('Supabase resetPasswordForEmail Error:', error); // Corrected error message
        throw error;
      }
    } catch (error) {
      console.error('Full resetPassword error object:', error); // Changed for consistency
      throw error;
    }
  };

  return {
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
  };
}