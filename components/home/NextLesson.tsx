import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Clock, Play } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';

interface NextLessonProps {
  title: string;
  duration: number;
  description?: string;
  thumbnail?: string;
  progress?: number;
  onStart: () => void;
}

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg';

export default function NextLesson({ 
  title, 
  duration, 
  description = 'Продолжите обучение с того места, где остановились в прошлый раз',
  thumbnail = FALLBACK_IMAGE,
  progress = 0,
  onStart 
}: NextLessonProps) {
  const [imageError, setImageError] = React.useState(false);

  const imageSource = { 
    uri: imageError ? FALLBACK_IMAGE : thumbnail,
    onError: () => setImageError(true)
  };

  return (
    <Card style={styles.container}>
      <View style={styles.imageBackground}>
        <Image 
          source={imageSource} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.durationContainer}>
            <Clock size={16} color={colors.neutral[300]} />
            <Text style={styles.durationText}>{duration} мин</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.textContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>

          <Button
            title="Начать"
            onPress={onStart}
            size="large"
            leftIcon={<Play size={20} color={colors.white} fill={colors.white} />}
            style={styles.button}
          />
        </View>

        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.x4,
    padding: 0,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-4px)',
        },
      },
    }),
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary[900],
    opacity: 0.9,
  },
  content: {
    padding: spacing.x4,
    paddingBottom: spacing.x6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.x4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: spacing.x1,
    paddingHorizontal: spacing.x2,
    borderRadius: layout.borderRadius.medium,
  },
  durationText: {
    ...getTextStyle('caption'),
    color: colors.neutral[300],
    marginLeft: spacing.x1,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginRight: spacing.x4,
  },
  title: {
    ...getTextStyle('heading', 'h1'),
    color: colors.white,
    marginBottom: spacing.x2,
  },
  description: {
    ...getTextStyle('body', 'large'),
    color: colors.neutral[300],
    opacity: 0.8,
  },
  button: {
    minWidth: 140,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.neutral[700],
    borderRadius: 2,
    marginTop: spacing.x4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },
});