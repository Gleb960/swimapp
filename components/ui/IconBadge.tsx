import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/spacing';

interface IconBadgeProps {
  icon: React.ReactNode;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function IconBadge({
  icon,
  size = 40,
  color = colors.primary[500],
  backgroundColor = colors.primary[50],
  style,
}: IconBadgeProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});