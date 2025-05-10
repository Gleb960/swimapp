import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      router.push('/onboarding');
    } catch (error: any) {
      if (error?.message?.includes('User already registered') || 
          error?.message?.includes('user_already_exists')) {
        setError('Этот email уже зарегистрирован. Воспользуйтесь формой входа или восстановите пароль, если вы его забыли.');
      } else {
        setError('Произошла ошибка при регистрации. Попробуйте позже.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.replace('/auth');
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Регистрация</Text>
        <Text style={styles.subtitle}>
          Создайте аккаунт, чтобы получить персональный план тренировок
        </Text>

        <Card style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Имя"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setError(null);
            }}
            autoCapitalize="words"
            placeholderTextColor={colors.neutral[400]}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor={colors.neutral[400]}
          />

          <TextInput
            style={styles.input}
            placeholder="Пароль"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
            }}
            secureTextEntry
            placeholderTextColor={colors.neutral[400]}
          />

          <TextInput
            style={styles.input}
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError(null);
            }}
            secureTextEntry
            placeholderTextColor={colors.neutral[400]}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            title="Создать аккаунт"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.button}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>или</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Войти в существующий аккаунт"
            variant="outline"
            onPress={handleLogin}
            style={styles.loginButton}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.x4,
    paddingTop: Platform.OS === 'android' ? spacing.x8 : spacing.x4,
  },
  title: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x2,
    textAlign: 'center',
  },
  subtitle: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.x6,
  },
  form: {
    marginBottom: spacing.x4,
  },
  input: {
    ...getTextStyle('body', 'medium'),
    height: 56,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: layout.borderRadius.medium,
    paddingHorizontal: spacing.x4,
    marginBottom: spacing.x3,
    color: colors.neutral[900],
    backgroundColor: colors.neutral[50],
  },
  errorText: {
    ...getTextStyle('body', 'small'),
    color: colors.error[500],
    marginBottom: spacing.x3,
    textAlign: 'center',
    padding: spacing.x2,
  },
  button: {
    marginTop: spacing.x2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.x4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  dividerText: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[500],
    marginHorizontal: spacing.x2,
  },
  loginButton: {
    marginTop: spacing.x2,
  },
});