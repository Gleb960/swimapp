import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronRight, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Card from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';

interface AiTipsProps {
  tip: string;
}

export default function AiTips({ tip }: AiTipsProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push('/chat');
  };

  return (
    <Card onPress={handlePress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MessageSquare size={20} color={colors.primary[500]} />
        </View>
        <Text style={styles.title}>Персональный тренер</Text>
        <ChevronRight size={20} color={colors.neutral[400]} />
      </View>
      
      <Text style={styles.tipText}>
        Задайте любой вопрос о технике плавания, тренировках или подготовке к соревнованиям
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.x4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.x2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.x2,
  },
  title: {
    ...getTextStyle('heading', 'h5'),
    color: colors.neutral[900],
    flex: 1,
  },
  tipText: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[700],
    paddingLeft: spacing.x6 + spacing.x2,
  },
});