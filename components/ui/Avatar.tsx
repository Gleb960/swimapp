import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { getTextStyle } from '@/constants/typography';
import { layout } from '@/constants/spacing';

interface AvatarProps {
  source?: { uri: string } | null;
  initials?: string;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function Avatar({
  source,
  initials,
  size = 40,
  backgroundColor = colors.primary[500],
  style,
}: AvatarProps) {
  // Calculate appropriate font size (roughly 40% of avatar size)
  const fontSize = Math.floor(size * 0.4);
  
  // Get first 2 characters for the initials
  const displayInitials = initials?.substring(0, 2)?.toUpperCase() || '';
  
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: source ? 'transparent' : backgroundColor,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize,
            },
          ]}
        >
          {displayInitials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsText: {
    color: colors.white,
    ...getTextStyle('heading', 'h5'),
  },
});