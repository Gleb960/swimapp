import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';

interface BarData {
  value: number;
  label: string;
  active?: boolean;
  completed?: boolean;
}

interface BarChartProps {
  data: BarData[];
  maxValue?: number;
  height?: number;
  barWidth?: number;
  barGap?: number;
  activeColor?: string;
  inactiveColor?: string;
  completedColor?: string;
}

export default function BarChart({
  data,
  maxValue,
  height = 120,
  barWidth = 24,
  barGap = 8,
  activeColor = colors.primary[500],
  inactiveColor = colors.neutral[200],
  completedColor = colors.success[500],
}: BarChartProps) {
  // Calculate the maximum value if not provided
  const calculatedMax = maxValue || Math.max(...data.map((item) => item.value), 1);
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          // Calculate the height percentage based on the max value
          const heightPercentage = (item.value / calculatedMax) * 100;
          
          // Determine the color of the bar
          let barColor = inactiveColor;
          if (item.completed) {
            barColor = completedColor;
          } else if (item.active) {
            barColor = activeColor;
          }
          
          return (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${heightPercentage}%`,
                    width: barWidth,
                    backgroundColor: barColor,
                    marginHorizontal: barGap / 2,
                  },
                ]}
              />
              <Text
                style={[
                  styles.barLabel,
                  {
                    width: barWidth,
                    marginHorizontal: barGap / 2,
                  },
                  item.active && styles.activeBarLabel,
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartContainer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    marginTop: spacing.x2,
    textAlign: 'center',
    ...getTextStyle('caption'),
    color: colors.neutral[600],
  },
  activeBarLabel: {
    color: colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
});