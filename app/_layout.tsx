import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import FontLoader from '@/components/FontLoader';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <FontLoader>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="plan" options={{ headerShown: false }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <AuthCheck />
    </FontLoader>
  );
}

function AuthCheck() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!session && Platform.OS === 'web' && !window.location.pathname.includes('/auth') && !window.location.pathname.includes('/register')) {
    return <Redirect href="/auth" />;
  }

  return null;
}