import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import BarChart from '@/components/ui/BarChart';

interface WeeklyGoalsProps {
  data: {
    value: number;
    label: string;
    active?: boolean;
    completed?: boolean;
  }[];
  streak: number;
  onEditPress: () => void;
}

export default function WeeklyGoals({
  data,
  streak,
  onEditPress,
}: WeeklyGoalsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Цели недели</Text>
        <TouchableOpacity onPress={onEditPress}>
          <Text style={styles.editText}>Изменить</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <BarChart 
          data={data} 
          height={120}
          barWidth={32}
        />
      </View>
      
      {streak > 0 && (
        <View style={styles.streakContainer}>
          <Flame size={16} color={colors.accent[500]} />
          <Text style={styles.streakText}>
            {streak} дня подряд
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.x4,
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
  editText: {
    ...getTextStyle('body', 'small'),
    color: colors.primary[500],
  },
  chartContainer: {
    marginBottom: spacing.x2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accent[50],
    borderRadius: 12,
    paddingHorizontal: spacing.x2,
    paddingVertical: spacing.x1,
  },
  streakText: {
    ...getTextStyle('body', 'small'),
    color: colors.accent[700],
    marginLeft: spacing.x1,
  },
});