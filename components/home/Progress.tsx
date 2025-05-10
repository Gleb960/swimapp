import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import ProgressRing from '@/components/ui/ProgressRing';

interface ProgressProps {
  distance: number; // in meters
  progress: number; // 0 to 100
  period?: string;
}

export default function Progress({
  distance,
  progress,
  period = 'на неделю',
}: ProgressProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Прогресс</Text>
      
      <View style={styles.contentContainer}>
        <View style={styles.videoPreview}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.videoImage}
          />
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.distanceText}>
            {distance} м
          </Text>
          <Text style={styles.periodText}>
            {period}
          </Text>
          
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={progress}
              size={80}
              strokeWidth={8}
              showPercentage={false}
            >
              <Text style={styles.progressText}>{progress}%</Text>
            </ProgressRing>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.x4,
  },
  sectionTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
    marginBottom: spacing.x3,
  },
  contentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  videoPreview: {
    width: '40%',
    height: 120,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statsContainer: {
    flex: 1,
    padding: spacing.x3,
  },
  distanceText: {
    ...getTextStyle('heading', 'h3'),
    color: colors.neutral[900],
  },
  periodText: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    marginBottom: spacing.x2,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    ...getTextStyle('heading', 'h5'),
    color: colors.primary[700],
  },
});