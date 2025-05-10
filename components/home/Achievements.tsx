import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Navigation, Trophy, Calendar, Timer, Flag, Target, Medal, Crown, Star, ChevronRight, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import IconBadge from '@/components/ui/IconBadge';
import Card from '@/components/ui/Card';

interface Achievement {
  id: string;
  icon: string;
  color: string;
  backgroundColor: string;
  label: string;
  unlocked: boolean;
  description?: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const getAchievementIcon = (type: string, color: string) => {
  switch (type) {
    case 'distance':
      return <Navigation size={24} color={color} />;
    case 'trophy':
      return <Trophy size={24} color={color} />;
    case 'calendar':
      return <Calendar size={24} color={color} />;
    case 'timer':
      return <Timer size={24} color={color} />;
    case 'flag':
      return <Flag size={24} color={color} />;
    case 'target':
      return <Target size={24} color={color} />;
    case 'medal':
      return <Medal size={24} color={color} />;
    case 'crown':
      return <Crown size={24} color={color} />;
    case 'star':
      return <Star size={24} color={color} />;
    default:
      return <Trophy size={24} color={color} />;
  }
};

export default function Achievements({ achievements }: AchievementsProps) {
  const router = useRouter();
  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;
  
  const handleViewAll = () => {
    router.push('/achievements');
  };

  const handleAchievementPress = (achievement: Achievement) => {
    if (!achievement.unlocked) return;
    router.push(`/achievements/${achievement.id}`);
  };
  
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Достижения</Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Все</Text>
          <ChevronRight size={16} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayAchievements.map((achievement) => (
          <TouchableOpacity 
            key={achievement.id} 
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.lockedAchievement
            ]}
            onPress={() => handleAchievementPress(achievement)}
            activeOpacity={0.7}
          >
            <IconBadge
              icon={getAchievementIcon(achievement.icon, achievement.unlocked ? achievement.color : colors.neutral[400])}
              backgroundColor={achievement.unlocked ? achievement.backgroundColor : colors.neutral[100]}
              size={48}
              style={styles.badge}
            />
            <Text style={[
              styles.achievementLabel,
              !achievement.unlocked && styles.lockedLabel
            ]}>
              {achievement.label}
            </Text>
            {achievement.description && (
              <Text style={[
                styles.achievementDescription,
                !achievement.unlocked && styles.lockedDescription
              ]}>
                {achievement.description}
              </Text>
            )}
            {!achievement.unlocked && (
              <View style={styles.lockIconContainer}>
                <Lock size={16} color={colors.neutral[400]} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Card>
  );
}

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    icon: 'distance',
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    label: '1000м',
    description: 'Проплыть 1км',
    unlocked: true,
  },
  {
    id: '2',
    icon: 'trophy',
    color: colors.secondary[500],
    backgroundColor: colors.secondary[50],
    label: '5000м',
    description: 'Проплыть 5км',
    unlocked: false,
  },
  {
    id: '3',
    icon: 'calendar',
    color: colors.accent[500],
    backgroundColor: colors.accent[50],
    label: '7 дней',
    description: 'Неделя тренировок',
    unlocked: true,
  },
  {
    id: '4',
    icon: 'timer',
    color: colors.success[500],
    backgroundColor: colors.success[50],
    label: 'Спринтер',
    description: 'Темп < 2 мин/100м',
    unlocked: false,
  },
  {
    id: '5',
    icon: 'flag',
    color: colors.warning[500],
    backgroundColor: colors.warning[50],
    label: 'Марафонец',
    description: 'Проплыть 10км',
    unlocked: false,
  },
];

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.x6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.x3,
  },
  sectionTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.x2,
  },
  viewAllText: {
    ...getTextStyle('body', 'medium'),
    color: colors.primary[500],
    marginRight: spacing.x1,
  },
  scrollContent: {
    paddingHorizontal: spacing.x1,
  },
  achievementCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.x3,
    marginRight: spacing.x2,
    alignItems: 'center',
    width: 120,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    }),
  },
  lockedAchievement: {
    backgroundColor: colors.neutral[50],
    opacity: 0.8,
  },
  badge: {
    marginBottom: spacing.x2,
  },
  achievementLabel: {
    ...getTextStyle('heading', 'h5'),
    color: colors.neutral[900],
    textAlign: 'center',
    marginBottom: spacing.x1,
  },
  achievementDescription: {
    ...getTextStyle('caption'),
    color: colors.neutral[600],
    textAlign: 'center',
  },
  lockedLabel: {
    color: colors.neutral[400],
  },
  lockedDescription: {
    color: colors.neutral[400],
  },
  lockIconContainer: {
    position: 'absolute',
    top: spacing.x2,
    right: spacing.x2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
});