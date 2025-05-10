import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Award, Settings, ChevronRight, LogOut, Bell, CircleHelp as HelpCircle, Shield, FileText, CreditCard, UserIcon, Navigation, Timer } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { api, Profile } from '@/lib/api';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  
  // User data - will be replaced by fetched data
  // const user = {
  //   name: 'Глеб Иванов',
  //   email: 'gleb@example.com',
  //   level: 'Начинающий',
  //   joinDate: 'Май 2023',
  //   achievements: 12,
  //   trainings: 25,
  //   distance: 15, // km
  // };

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        setLoadingProfile(true);
        try {
          const fetchedProfile = await api.profiles.get();
          console.log('Fetched profile:', fetchedProfile);
          setProfile(fetchedProfile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          setProfile(null);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    fetchProfile();
  }, [session]);
  
  // Menu sections
  const menuSections = [
    {
      title: 'Аккаунт',
      items: [
        { id: 'profile', icon: <UserIcon size={20} color={colors.neutral[600]} />, label: 'Личные данные' }, // Changed icon to UserIcon
        { id: 'payment', icon: <CreditCard size={20} color={colors.neutral[600]} />, label: 'Подписка' },
        { id: 'settings', icon: <Settings size={20} color={colors.neutral[600]} />, label: 'Настройки' },
        { id: 'notifications', icon: <Bell size={20} color={colors.neutral[600]} />, label: 'Уведомления' },
      ],
    },
    {
      title: 'Информация',
      items: [
        { id: 'help', icon: <HelpCircle size={20} color={colors.neutral[600]} />, label: 'Помощь' },
        { id: 'privacy', icon: <Shield size={20} color={colors.neutral[600]} />, label: 'Конфиденциальность' },
        { id: 'terms', icon: <FileText size={20} color={colors.neutral[600]} />, label: 'Условия использования' },
      ],
    },
  ];
  
  const handleMenuItemPress = (id: string) => {
    if (id === 'payment') {
      router.push('/payment');
    } else {
      console.log('Menu item pressed:', id);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      // После успешного выхода перенаправляем на экран авторизации
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Render menu section
  const renderMenuSection = (section: { title: string; items: { id: string; icon: JSX.Element; label: string; }[] }, index: number) => (
    <View key={index} style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{section.title}</Text>
      <Card style={styles.menuCard}>
        {section.items.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              idx < section.items.length - 1 && styles.menuItemBorder,
            ]}
            onPress={() => handleMenuItemPress(item.id)}
            // Disable profile item if profile is loading or not available
            disabled={item.id === 'profile' && (loadingProfile || !profile)}
          >
            <View style={styles.menuItemContent}>
              {item.icon}
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        ))}
      </Card>
    </View>
  );
  
  if (loadingProfile) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Загрузка профиля...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Профиль</Text>
        </View>
        
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              source={profile?.avatar_url ? { uri: profile.avatar_url } : null}
              initials={profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : '??'}
              size={80}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profile?.full_name || 'Имя не указано'}</Text>
              <Text style={styles.userEmail}>{profile?.email || 'Email не указан'}</Text>
              <Badge
                label="Начинающий"
                variant="primary"
                size="small"
                style={styles.levelBadge}
              />
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Award size={20} color={colors.primary[500]} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Достижения</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Timer size={20} color={colors.primary[500]} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Тренировки</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Navigation size={20} color={colors.primary[500]} />
              <Text style={styles.statValue}>0 км</Text>
              <Text style={styles.statLabel}>Дистанция</Text>
            </View>
          </View>
        </Card>

        {menuSections.map(renderMenuSection)}
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error[500]} />
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.x4,
    paddingTop: Platform.OS === 'android' ? spacing.x8 : spacing.x4,
    paddingBottom: spacing.x8,
  },
  centered: { // Added for loading state
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { // Added for loading state
    marginTop: spacing.x2,
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[700],
  },
  header: {
    marginBottom: spacing.x4,
  },
  screenTitle: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
  },
  profileCard: {
    marginBottom: spacing.x4,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: spacing.x4,
  },
  profileInfo: {
    marginLeft: spacing.x3,
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    ...getTextStyle('heading', 'h3'),
    color: colors.neutral[900],
  },
  userEmail: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    marginBottom: spacing.x2,
  },
  levelBadge: {
    alignSelf: 'flex-start',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    paddingTop: spacing.x3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.neutral[100],
  },
  statValue: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
    marginTop: spacing.x1,
  },
  statLabel: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
  },
  menuSection: {
    marginBottom: spacing.x4,
  },
  menuSectionTitle: {
    ...getTextStyle('heading', 'h5'),
    color: colors.neutral[700],
    marginBottom: spacing.x2,
    marginLeft: spacing.x1,
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.x3,
    paddingHorizontal: spacing.x4,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[800],
    marginLeft: spacing.x3,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.x4,
  },
  logoutText: {
    ...getTextStyle('body', 'medium'),
    color: colors.error[500],
    marginLeft: spacing.x2,
  },
});