import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { getTextStyle } from '@/constants/typography';
import { spacing, layout } from '@/constants/spacing';

interface BadgeProps {
  children?: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'small' | 'medium';
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export default function Badge({
  children,
  label,
  variant = 'primary',
  size = 'medium',
  style,
  icon,
}: BadgeProps) {
  // Get color based on variant
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary[100];
      case 'secondary':
        return colors.secondary[100];
      case 'success':
        return colors.success[100];
      case 'warning':
        return colors.warning[100];
      case 'error':
        return colors.error[100];
      case 'neutral':
      default:
        return colors.neutral[100];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary[700];
      case 'secondary':
        return colors.secondary[700];
      case 'success':
        return colors.success[700];
      case 'warning':
        return colors.warning[700];
      case 'error':
        return colors.error[700];
      case 'neutral':
      default:
        return colors.neutral[700];
    }
  };

  // Size variants
  const sizeStyles = {
    small: {
      height: 24,
      paddingHorizontal: spacing.x2,
      borderRadius: layout.borderRadius.medium,
    },
    medium: {
      height: 32,
      paddingHorizontal: spacing.x3,
      borderRadius: layout.borderRadius.medium,
    },
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() },
        sizeStyles[size],
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      {label && (
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            size === 'small' ? styles.smallText : styles.mediumText,
          ]}
        >
          {label}
        </Text>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.x1,
  },
  text: {
    ...getTextStyle('caption'),
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
});