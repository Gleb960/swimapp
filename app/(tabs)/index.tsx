import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

// Components
import Greeting from '@/components/home/Greeting';
import NextLesson from '@/components/home/NextLesson';
import QuickActions from '@/components/home/QuickActions';
import AiTips from '@/components/home/AiTips';
import LastTraining from '@/components/home/LastTraining';
import WeeklyGoals from '@/components/home/WeeklyGoals';
import Achievements from '@/components/home/Achievements';

const weeklyData = [
  { value: 20, label: 'Пн', completed: true },
  { value: 50, label: 'Вт', completed: true },
  { value: 30, label: 'Ср', completed: true },
  { value: 0, label: 'Чт', active: true },
  { value: 0, label: 'Пт' },
  { value: 0, label: 'Сб' },
  { value: 0, label: 'Вс' },
];

const achievements = [
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
];

export default function HomeScreen() {
  const handleStartLesson = () => {
    console.log('Start lesson');
  };
  
  const handleVideoPress = () => {
    console.log('Video pressed');
  };
  
  const handlePlanPress = () => {
    console.log('Plan pressed');
  };
  
  const handleStartPress = () => {
    console.log('Start pressed');
  };
  
  const handleEditGoals = () => {
    console.log('Edit goals');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Greeting userName="Глеб" />
        
        <NextLesson
          title="Основы кроля"
          duration={30}
          onStart={handleStartLesson}
          thumbnail="https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg"
        />
        
        <QuickActions
          onVideoPress={handleVideoPress}
          onPlanPress={handlePlanPress}
          onStartPress={handleStartPress}
        />
        
        <AiTips
          tip="Попробуйте упражнение №4 для улучшения техники"
        />
        
        <LastTraining
          data={{
            duration: 45,
            distance: 1200,
            pace: 125,
            date: '12 марта',
            improvement: {
              type: 'distance',
              value: '200м',
            }
          }}
          thumbnail="https://images.pexels.com/photos/1415810/pexels-photo-1415810.jpeg"
        />
        
        <WeeklyGoals
          data={weeklyData}
          streak={3}
          onEditPress={handleEditGoals}
        />
        
        <Achievements
          achievements={achievements}
        />
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
    backgroundColor: colors.neutral[50],
  },
  contentContainer: {
    padding: spacing.x4,
    paddingTop: Platform.OS === 'android' ? spacing.x8 : spacing.x4,
  },
});