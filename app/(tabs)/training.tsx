import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Timer, Navigation, Heart, Flame, Activity, Info, Construction } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressRing from '@/components/ui/ProgressRing';

const hrZones = [
  { name: 'Zone 1', range: '<111', color: '#4A90E2' },  // Blue
  { name: 'Zone 2', range: '111-129', color: '#7ED321' },  // Green
  { name: 'Zone 3', range: '130-147', color: '#F8E71C' },  // Yellow
  { name: 'Zone 4', range: '148-166', color: '#FF9500' },  // Orange
  { name: 'Zone 5', range: '≥167', color: '#FF3B30' },  // Red
];

const currentWorkout = {
  inProgress: false,
  duration: 0,
  distance: 0,
  pace: 0,
};

const lastWorkout = {
  duration: 2400,
  distance: 1500,
  pace: 95,
  heartRate: {
    avg: 145,
    max: 165,
    zones: [10, 25, 40, 20, 5],
  },
  calories: {
    active: 450,
    dailyGoal: 800,
  },
  splits: [
    { distance: 100, time: 95, rest: 15 },
    { distance: 100, time: 93, rest: 20 },
    { distance: 100, time: 94, rest: 15 },
    { distance: 100, time: 92, rest: 0 },
  ],
};

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

function MetricCard({ title, value, unit, icon, color, description }: MetricCardProps) {
  return (
    <Card style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: color + '15' }]}>
        {icon}
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
      {description && (
        <Text style={styles.metricDescription}>{description}</Text>
      )}
    </Card>
  );
}

function HeartRateZones({ zones }: { zones: number[] }) {
  return (
    <View style={styles.heartRateContainer}>
      <View style={styles.heartZones}>
        {zones.map((percentage, index) => (
          <View
            key={index}
            style={[
              styles.heartZone,
              { backgroundColor: hrZones[index].color, flex: percentage },
            ]}
          />
        ))}
      </View>
      <View style={styles.zonesLegend}>
        {hrZones.map((zone, index) => (
          <View key={index} style={styles.zoneItem}>
            <Text style={[styles.zoneRange, { color: zone.color }]}>{zone.range}</Text>
            <Text style={styles.zoneName}>Zone {index + 1}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function TrainingScreen() {
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleStartTraining = () => {
    setIsTraining(true);
    setIsPaused(false);
  };

  const handlePauseTraining = () => {
    setIsPaused(!isPaused);
  };

  const handleStopTraining = () => {
    setIsTraining(false);
    setIsPaused(false);
  };

  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Тренировка</Text>

        {isTraining ? (
          <Card style={styles.activeWorkout}>
            <View style={styles.workoutMetrics}>
              <View style={styles.mainMetric}>
                <ProgressRing
                  progress={75}
                  size={160}
                  strokeWidth={8}
                  showPercentage={false}
                >
                  <View style={styles.ringContent}>
                    <Text style={styles.ringValue}>32:15</Text>
                    <Text style={styles.ringLabel}>Время</Text>
                  </View>
                </ProgressRing>
              </View>

              <View style={styles.secondaryMetrics}>
                <View style={styles.metric}>
                  <Navigation size={24} color={colors.primary[500]} />
                  <Text style={styles.metricValue}>1250</Text>
                  <Text style={styles.metricLabel}>метров</Text>
                </View>

                <View style={styles.metric}>
                  <Activity size={24} color={colors.secondary[500]} />
                  <Text style={styles.metricValue}>1:55</Text>
                  <Text style={styles.metricLabel}>/100м</Text>
                </View>
              </View>
            </View>

            <View style={styles.controls}>
              <Button
                title={isPaused ? "Продолжить" : "Пауза"}
                onPress={handlePauseTraining}
                size="large"
                variant="primary"
                style={styles.controlButton}
              />
              <Button
                title="Завершить"
                onPress={handleStopTraining}
                size="large"
                variant="outline"
                style={styles.controlButton}
              />
            </View>
          </Card>
        ) : (
          <Card style={styles.startCard}>
            <Text style={styles.startTitle}>Готовы к тренировке?</Text>
            <Text style={styles.startDescription}>
              Нажмите кнопку "Старт" чтобы начать отслеживать вашу тренировку
            </Text>
            <Button
              title="Старт"
              onPress={handleStartTraining}
              size="large"
              fullWidth
            />
          </Card>
        )}

        <View style={styles.lastWorkoutSection}>
          <Text style={styles.sectionTitle}>Последняя тренировка</Text>

          <View style={styles.metricsGrid}>
            <MetricCard
              title="Дистанция"
              value={lastWorkout.distance}
              unit="м"
              icon={<Navigation size={24} color={colors.primary[500]} />}
              color={colors.primary[500]}
            />

            <MetricCard
              title="Время"
              value={formatPace(lastWorkout.duration)}
              icon={<Timer size={24} color={colors.secondary[500]} />}
              color={colors.secondary[500]}
            />

            <MetricCard
              title="Темп"
              value={formatPace(lastWorkout.pace)}
              unit="/100м"
              icon={<Activity size={24} color={colors.accent[500]} />}
              color={colors.accent[500]}
            />

            <MetricCard
              title="Калории"
              value={lastWorkout.calories.active}
              unit="ккал"
              icon={<Flame size={24} color={colors.error[500]} />}
              color={colors.error[500]}
              description={`${Math.round((lastWorkout.calories.active / lastWorkout.calories.dailyGoal) * 100)}% от цели`}
            />
          </View>

          <Card style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Пульс</Text>
              <View style={styles.hrInfo}>
                <Heart size={20} color="#0052CC" />
                <Text style={styles.hrText}>
                  {lastWorkout.heartRate.avg} / {lastWorkout.heartRate.max} уд/мин
                </Text>
                <View style={styles.infoIcon}>
                  <Info size={16} color={colors.neutral[400]} />
                </View>
              </View>
            </View>
            <HeartRateZones zones={lastWorkout.heartRate.zones} />
          </Card>

          <Card style={styles.comingSoonCard}>
            <View style={styles.comingSoonHeader}>
              <Construction size={24} color={colors.primary[500]} />
              <Text style={styles.comingSoonTitle}>Умный анализ техники</Text>
            </View>
            <Text style={styles.comingSoonDescription}>
              Скоро здесь появится детальный анализ вашей техники плавания на основе данных с часов.
            </Text>
          </Card>
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
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.x4,
    paddingTop: Platform.OS === 'android' ? spacing.x8 : spacing.x4,
  },
  screenTitle: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x4,
  },
  activeWorkout: {
    marginBottom: spacing.x4,
  },
  workoutMetrics: {
    alignItems: 'center',
    paddingVertical: spacing.x4,
  },
  mainMetric: {
    marginBottom: spacing.x4,
  },
  ringContent: {
    alignItems: 'center',
  },
  ringValue: {
    ...getTextStyle('heading', 'h2'),
    color: colors.primary[700],
  },
  ringLabel: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
  },
  secondaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    ...getTextStyle('heading', 'h3'),
    color: colors.neutral[900],
    marginVertical: spacing.x1,
  },
  metricLabel: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
  },
  controls: {
    flexDirection: 'row',
    padding: spacing.x4,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  controlButton: {
    flex: 1,
    marginHorizontal: spacing.x2,
  },
  startCard: {
    marginBottom: spacing.x4,
    alignItems: 'center',
    padding: spacing.x6,
  },
  startTitle: {
    ...getTextStyle('heading', 'h3'),
    color: colors.neutral[900],
    marginBottom: spacing.x2,
    textAlign: 'center',
  },
  startDescription: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    marginBottom: spacing.x4,
    textAlign: 'center',
  },
  lastWorkoutSection: {
    marginTop: spacing.x4,
  },
  sectionTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
    marginBottom: spacing.x3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.x2,
    marginBottom: spacing.x4,
  },
  metricCard: {
    width: '50%',
    paddingHorizontal: spacing.x2,
    marginBottom: spacing.x4,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.x2,
  },
  metricTitle: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    marginBottom: spacing.x1,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricUnit: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    marginLeft: spacing.x1,
  },
  metricDescription: {
    ...getTextStyle('caption'),
    color: colors.neutral[500],
    marginTop: spacing.x1,
  },
  detailCard: {
    marginBottom: spacing.x4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.x3,
  },
  cardTitle: {
    ...getTextStyle('heading', 'h5'),
    color: colors.neutral[900],
  },
  hrInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hrText: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[900],
    marginLeft: spacing.x2,
  },
  infoIcon: {
    marginLeft: spacing.x2,
    opacity: 0.6,
  },
  heartRateContainer: {
    marginBottom: spacing.x2,
  },
  heartZones: {
    flexDirection: 'row',
    height: 24,
    borderRadius: layout.borderRadius.medium,
    overflow: 'hidden',
    marginBottom: spacing.x2,
  },
  heartZone: {
    height: '100%',
  },
  zonesLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.x2,
  },
  zoneItem: {
    alignItems: 'center',
    flex: 1,
  },
  zoneRange: {
    ...getTextStyle('caption'),
    marginBottom: spacing.x1,
  },
  zoneName: {
    ...getTextStyle('caption'),
    color: colors.neutral[900],
    fontFamily: 'Inter-Medium',
  },
  comingSoonCard: {
    backgroundColor: colors.primary[50],
    marginBottom: spacing.x4,
  },
  comingSoonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.x2,
  },
  comingSoonTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.primary[700],
    marginLeft: spacing.x2,
  },
  comingSoonDescription: {
    ...getTextStyle('body', 'medium'),
    color: colors.primary[600],
  },
});