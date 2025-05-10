import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Avatar from '@/components/ui/Avatar';

interface GreetingProps {
  userName: string;
  avatarUrl?: string;
  onNotificationsPress?: () => void;
  onAvatarPress?: () => void;
}

export default function Greeting({ 
  userName, 
  avatarUrl,
  onNotificationsPress,
  onAvatarPress 
}: GreetingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Привет, {userName}! 👋</Text>
          <Text style={styles.subtitle}>Готов к новым достижениям?</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={onNotificationsPress}
          >
            <Bell size={20} color={colors.neutral[700]} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onAvatarPress}>
            <Avatar
              source={avatarUrl ? { uri: avatarUrl } : null}
              initials={userName.substring(0, 1)}
              size={48}
              backgroundColor={colors.primary[100]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.x4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x1,
  },
  subtitle: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[500],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.x3,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: colors.neutral[50],
        },
      },
    }),
  },
  notificationBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[500],
    position: 'absolute',
    top: 10,
    right: 10,
  },
});