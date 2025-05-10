import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AuthScreen from '../app/auth';
import RegisterScreen from '../app/register';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('AuthScreen', () => {
  const mockSignInWithEmail = jest.fn();
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signInWithEmail: mockSignInWithEmail,
    });
  });

  it('shows error when fields are empty', () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);
    
    const loginButton = getByText('Войти');
    fireEvent.press(loginButton);
    
    expect(getByText('Пожалуйста, заполните все поля')).toBeTruthy();
  });

  it('calls signInWithEmail with correct credentials', async () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Пароль');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    const loginButton = getByText('Войти');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});

describe('RegisterScreen', () => {
  const mockSignUpWithEmail = jest.fn();
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signUpWithEmail: mockSignUpWithEmail,
    });
  });

  it('shows error when passwords do not match', () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    const nameInput = getByPlaceholderText('Имя');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Пароль');
    const confirmPasswordInput = getByPlaceholderText('Подтвердите пароль');
    
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password456');
    
    const registerButton = getByText('Создать аккаунт');
    fireEvent.press(registerButton);
    
    expect(getByText('Пароли не совпадают')).toBeTruthy();
  });

  it('shows error when password is too short', () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    const nameInput = getByPlaceholderText('Имя');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Пароль');
    const confirmPasswordInput = getByPlaceholderText('Подтвердите пароль');
    
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '12345');
    fireEvent.changeText(confirmPasswordInput, '12345');
    
    const registerButton = getByText('Создать аккаунт');
    fireEvent.press(registerButton);
    
    expect(getByText('Пароль должен содержать минимум 6 символов')).toBeTruthy();
  });

  it('calls signUpWithEmail with correct data', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    const nameInput = getByPlaceholderText('Имя');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Пароль');
    const confirmPasswordInput = getByPlaceholderText('Подтвердите пароль');
    
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    const registerButton = getByText('Создать аккаунт');
    fireEvent.press(registerButton);
    
    await waitFor(() => {
      expect(mockSignUpWithEmail).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'Test User'
      );
    });
  });
});