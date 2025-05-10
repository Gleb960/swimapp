import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: number;
  variant?: 'filled' | 'outlined';
}

export default function Card({
  children,
  style,
  onPress,
  elevation = 1,
  variant = 'filled',
}: CardProps) {
  const cardStyles = [
    styles.card,
    variant === 'outlined' ? styles.outlined : styles.filled,
    elevation === 2 && styles.elevationMedium,
    elevation === 3 && styles.elevationHigh,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.borderRadius.medium,
    padding: layout.cardPadding,
    overflow: 'hidden',
  },
  filled: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  outlined: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  elevationMedium: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  elevationHigh: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});