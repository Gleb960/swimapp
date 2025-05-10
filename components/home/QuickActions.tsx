import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Video, ClipboardList, Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import QuickActionButton from '@/components/ui/QuickActionButton';
import { colors } from '@/constants/colors';
import { getTextStyle } from '@/constants/typography';
import { spacing, layout } from '@/constants/spacing';
import Card from '@/components/ui/Card';

interface QuickActionsProps {
  onPlanPress: () => void;
}

export default function QuickActions({
  onPlanPress,
}: QuickActionsProps) {
  const router = useRouter();

  const handleVideoPress = () => {
    router.push('/learn');
  };

  const handlePlanPress = () => {
    router.push('/plan');
    onPlanPress();
  };

  const handleStartPress = () => {
    router.push('/training');
  };

  return (
    <Card style={styles.container}>
      <View style={styles.actionsContainer}>
        <QuickActionButton
          label="Видео"
          icon={<Video size={20} color={colors.primary[600]} />}
          onPress={handleVideoPress}
          style={styles.action}
          variant="primary"
        />
        
        <View style={styles.divider} />
        
        <QuickActionButton
          label="Мой план"
          icon={<ClipboardList size={20} color={colors.secondary[600]} />}
          onPress={handlePlanPress}
          style={styles.action}
          variant="secondary"
        />
        
        <View style={styles.divider} />
        
        <QuickActionButton
          label="Старт"
          icon={<Play size={20} color={colors.accent[600]} fill={colors.accent[600]} />}
          onPress={handleStartPress}
          style={styles.action}
          variant="accent"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.x4,
    ...Platform.select({
      web: {
        transition: 'transform 0.2s ease',
        ':hover': {
          transform: 'translateY(-2px)',
        },
      },
    }),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  action: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[100],
    marginHorizontal: spacing.x2,
  },
});