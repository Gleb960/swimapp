import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Timer, Navigation, TrendingUp, ChevronRight, Trophy } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface LastTrainingProps {
  data: {
    duration: number;
    distance: number;
    pace: number;
    date: string;
    improvement?: {
      type: 'distance' | 'pace' | 'duration';
      value: string;
    };
  };
  thumbnail?: string;
}

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/1415810/pexels-photo-1415810.jpeg';

export default function LastTraining({ 
  data,
  thumbnail = FALLBACK_IMAGE
}: LastTrainingProps) {
  const router = useRouter();
  const [imageError, setImageError] = React.useState(false);

  const handlePress = () => {
    router.push('/training');
  };

  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const imageSource = {
    uri: imageError ? FALLBACK_IMAGE : thumbnail,
    onError: () => setImageError(true)
  };

  return (
    <Card onPress={handlePress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
        />
        <View style={styles.overlay} />
        
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Последняя тренировка</Text>
            <Text style={styles.date}>{data.date}</Text>
          </View>
          {data.improvement && (
            <Badge
              label={`+${data.improvement.value}`}
              variant="success"
              size="small"
              icon={<Trophy size={12} color={colors.success[700]} />}
              style={styles.badge}
            />
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <View style={styles.statIconContainer}>
            <Timer size={20} color={colors.primary[500]} />
          </View>
          <Text style={styles.statValue}>{data.duration} мин</Text>
          <Text style={styles.statLabel}>Время</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <View style={styles.statIconContainer}>
            <Navigation size={20} color={colors.primary[500]} />
          </View>
          <Text style={styles.statValue}>{data.distance}м</Text>
          <Text style={styles.statLabel}>Дистанция</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <View style={styles.statIconContainer}>
            <TrendingUp size={20} color={colors.primary[500]} />
          </View>
          <Text style={styles.statValue}>{formatPace(data.pace)}</Text>
          <Text style={styles.statLabel}>Темп/100м</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewMore} onPress={handlePress}>
        <Text style={styles.viewMoreText}>Подробная статистика</Text>
        <ChevronRight size={16} color={colors.primary[500]} />
      </TouchableOpacity>
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
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary[900],
    opacity: 0.85,
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.x4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...getTextStyle('heading', 'h4'),
    color: colors.white,
    marginBottom: spacing.x1,
  },
  date: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[300],
  },
  badge: {
    marginLeft: spacing.x2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.x4,
    backgroundColor: colors.white,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.x2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.x2,
    height: '100%',
  },
  statValue: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
  },
  statLabel: {
    ...getTextStyle('caption'),
    color: colors.neutral[600],
    marginTop: spacing.x1,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.x3,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    backgroundColor: colors.neutral[50],
  },
  viewMoreText: {
    ...getTextStyle('body', 'medium'),
    color: colors.primary[500],
    marginRight: spacing.x1,
  },
});