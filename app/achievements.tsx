import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trophy, Navigation, Calendar, Timer, Flag, Target, Medal, Crown, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from '@/components/ui/Card';
import IconBadge from '@/components/ui/IconBadge';

const achievements = [
  {
    id: '1',
    icon: 'distance',
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    label: '1000м',
    description: 'Проплыть 1км',
    unlocked: true,
    date: '12 марта 2024',
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
    date: '10 марта 2024',
  },
  {
    id: '4',
    icon: 'timer',
    color: colors.success[500],
    backgroundColor: colors.success[50],
    label: 'Спринтер',
    description: 'Проплыть 100м менее чем за 1:30',
    unlocked: false,
  },
  {
    id: '5',
    icon: 'flag',
    color: colors.warning[500],
    backgroundColor: colors.warning[50],
    label: 'Марафонец',
    description: 'Проплыть 10км за одну тренировку',
    unlocked: false,
  },
  {
    id: '6',
    icon: 'target',
    color: colors.error[500],
    backgroundColor: colors.error[50],
    label: 'Целеустремленный',
    description: 'Достичь 5 целей подряд',
    unlocked: true,
    date: '5 марта 2024',
  },
  {
    id: '7',
    icon: 'medal',
    color: colors.primary[700],
    backgroundColor: colors.primary[50],
    label: 'Мастер техники',
    description: 'Завершить все уроки по технике',
    unlocked: false,
  },
  {
    id: '8',
    icon: 'crown',
    color: colors.secondary[700],
    backgroundColor: colors.secondary[50],
    label: 'Чемпион',
    description: 'Установить личный рекорд 10 раз',
    unlocked: false,
  },
  {
    id: '9',
    icon: 'star',
    color: colors.accent[700],
    backgroundColor: colors.accent[50],
    label: 'Звезда бассейна',
    description: 'Тренироваться 30 дней подряд',
    unlocked: false,
  },
];

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

export default function AchievementsScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Card onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.neutral[600]} />
        </Card>
        <Text style={styles.title}>Достижения</Text>
      </View>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stats}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Получено</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Осталось</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>33%</Text>
            <Text style={styles.statLabel}>Прогресс</Text>
          </Card>
        </View>
        
        <View style={styles.grid}>
          {achievements.map((achievement) => (
            <Card key={achievement.id} style={[
              styles.achievementCard,
              !achievement.unlocked && styles.lockedCard
            ]}>
              <IconBadge
                icon={getAchievementIcon(achievement.icon, achievement.unlocked ? achievement.color : colors.neutral[400])}
                backgroundColor={achievement.unlocked ? achievement.backgroundColor : colors.neutral[100]}
                size={48}
                style={styles.achievementIcon}
              />
              <Text style={[
                styles.achievementLabel,
                !achievement.unlocked && styles.lockedText
              ]}>
                {achievement.label}
              </Text>
              <Text style={[
                styles.achievementDescription,
                !achievement.unlocked && styles.lockedText
              ]}>
                {achievement.description}
              </Text>
              {achievement.unlocked && achievement.date && (
                <Text style={styles.achievementDate}>
                  {achievement.date}
                </Text>
              )}
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.x4,
    paddingTop: Platform.OS === 'android' ? spacing.x8 : spacing.x4,
  },
  backButton: {
    padding: spacing.x2,
    marginRight: spacing.x3,
  },
  title: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.x4,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: spacing.x4,
    gap: spacing.x3,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.x3,
  },
  statValue: {
    ...getTextStyle('heading', 'h3'),
    color: colors.neutral[900],
    marginBottom: spacing.x1,
  },
  statLabel: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.x3,
  },
  achievementCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.x3,
    flex: 1,
    minWidth: 150,
  },
  lockedCard: {
    backgroundColor: colors.neutral[50],
    borderColor: colors.neutral[200],
  },
  achievementIcon: {
    marginBottom: spacing.x2,
  },
  achievementLabel: {
    ...getTextStyle('heading', 'h5'),
    color: colors.neutral[900],
    textAlign: 'center',
    marginBottom: spacing.x1,
  },
  achievementDescription: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.x2,
  },
  achievementDate: {
    ...getTextStyle('caption'),
    color: colors.neutral[500],
  },
  lockedText: {
    color: colors.neutral[400],
  },
});