import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { getTextStyle } from '@/constants/typography';
import { spacing, layout } from '@/constants/spacing';

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  style?: any;
}

export default function QuickActionButton({
  label,
  icon,
  onPress,
  variant = 'primary',
  style,
}: QuickActionButtonProps) {
  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: colors.secondary[50],
          hover: colors.secondary[100],
          text: colors.secondary[700],
        };
      case 'accent':
        return {
          bg: colors.accent[50],
          hover: colors.accent[100],
          text: colors.accent[700],
        };
      default:
        return {
          bg: colors.primary[50],
          hover: colors.primary[100],
          text: colors.primary[700],
        };
    }
  };

  const variantColors = getColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: variantColors.bg },
        Platform.select({
          web: {
            ':hover': {
              backgroundColor: variantColors.hover,
            },
          },
        }),
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[
        styles.label,
        { color: variantColors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.x3,
    borderRadius: layout.borderRadius.medium,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  iconContainer: {
    marginBottom: spacing.x2,
  },
  label: {
    ...getTextStyle('body', 'small'),
    fontFamily: 'Inter-Medium',
  },
});