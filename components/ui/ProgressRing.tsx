import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/colors';
import { getTextStyle } from '@/constants/typography';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  bgColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  children?: React.ReactNode;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  bgColor = colors.neutral[100],
  progressColor = colors.primary[500],
  showPercentage = true,
  children,
}: ProgressRingProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Calculate the radius (half of size minus stroke width for proper fitting)
  const radius = (size - strokeWidth) / 2;
  
  // Calculate center point
  const center = size / 2;
  
  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash offset based on progress
  const strokeDashoffset = circumference - (circumference * clampedProgress) / 100;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          // Rotate to start from top
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      
      {/* Center Content */}
      <View style={styles.content}>
        {children || (
          showPercentage && (
            <Text style={styles.percentageText}>{Math.round(clampedProgress)}%</Text>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    ...getTextStyle('heading', 'h3'),
    color: colors.primary[700],
  },
});