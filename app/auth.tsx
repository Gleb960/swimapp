import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function AuthScreen() {
  const router = useRouter();
  const { signInWithEmail, resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error?.message?.includes('Invalid login credentials')) {
        setError('Неверный email или пароль. Проверьте правильность введенных данных или воспользуйтесь восстановлением пароля.');
      } else {
        setError('Произошла ошибка при входе. Попробуйте позже.');
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Пожалуйста, введите email для восстановления пароля');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsResettingPassword(true);

    try {
      await resetPassword(email);
      setSuccessMessage('Инструкции по сбросу пароля отправлены на ваш email');
      setError(null);
    } catch (error: any) {
      setError('Не удалось отправить инструкции. Проверьте правильность email.');
      console.error('Password reset error:', error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg' }}
          style={styles.heroImage}
        />
        <View style={styles.overlay} />
        
        <View style={styles.heroContent}>
          <Text style={styles.title}>SwimCoach</Text>
          <Text style={styles.subtitle}>
            Персональный тренер{'\n'}и план тренировок
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>С возвращением!</Text>
        <Text style={styles.description}>
          Войдите, чтобы продолжить свой путь к совершенству в плавании
        </Text>

        <Card style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
              setSuccessMessage(null);
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

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}

          <Button
            title="Войти"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.button}
          />

          <Button
            title="Забыли пароль?"
            variant="ghost"
            onPress={handlePasswordReset}
            isLoading={isResettingPassword}
            style={styles.forgotPasswordButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>или</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Создать новый аккаунт"
            variant="outline"
            onPress={handleRegister}
            style={styles.registerButton}
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
  heroSection: {
    height: Platform.OS === 'web' ? '50vh' : '50%',
    minHeight: 300,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary[900],
    opacity: 0.85,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.x8,
    left: 0,
    right: 0,
    padding: spacing.x4,
  },
  title: {
    ...getTextStyle('heading', 'h1'),
    color: colors.white,
    marginBottom: spacing.x2,
    textAlign: 'center',
    fontSize: 40,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...getTextStyle('body', 'large'),
    color: colors.neutral[100],
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 24,
  },
  content: {
    padding: spacing.x4,
    paddingTop: spacing.x8,
  },
  welcomeText: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x2,
    textAlign: 'center',
  },
  description: {
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
  successText: {
    ...getTextStyle('body', 'small'),
    color: colors.success[500],
    marginBottom: spacing.x3,
    textAlign: 'center',
    padding: spacing.x2,
  },
  button: {
    marginTop: spacing.x2,
  },
  forgotPasswordButton: {
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
  registerButton: {
    marginTop: spacing.x2,
  },
});