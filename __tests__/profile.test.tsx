import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../app/(tabs)/profile';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

// Mock the hooks and API
jest.mock('@/hooks/useAuth');
jest.mock('@/lib/api');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('ProfileScreen', () => {
  const mockSession = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
  };

  const mockProfile = {
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      signOut: jest.fn(),
      session: mockSession,
    });

    // Mock API calls
    (api.profiles.get as jest.Mock).mockResolvedValue(mockProfile);
  });

  it('renders loading state initially', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Загрузка профиля...')).toBeTruthy();
  });

  it('renders profile data after loading', async () => {
    render(<ProfileScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeTruthy();
      expect(screen.getByText('test@example.com')).toBeTruthy();
    });
  });

  it('handles profile loading error', async () => {
    // Mock API error
    (api.profiles.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch profile'));
    
    render(<ProfileScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Имя не указано')).toBeTruthy();
      expect(screen.getByText('Email не указан')).toBeTruthy();
    });
  });

  it('handles logout', async () => {
    const mockSignOut = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
      session: mockSession,
    });

    render(<ProfileScreen />);
    
    await waitFor(() => {
      const logoutButton = screen.getByText('Выйти');
      fireEvent.press(logoutButton);
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('navigates to payment screen when payment menu item is pressed', async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue(mockRouter);

    render(<ProfileScreen />);
    
    await waitFor(() => {
      const paymentButton = screen.getByText('Подписка');
      fireEvent.press(paymentButton);
      expect(mockRouter.push).toHaveBeenCalledWith('/payment');
    });
  });
}); 