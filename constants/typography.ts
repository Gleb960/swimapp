import { Platform } from 'react-native';

export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const typography = {
  heading: {
    h1: {
      fontFamily: fontFamily.bold,
      fontSize: 32,
      lineHeight: 38, // ~120% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    h2: {
      fontFamily: fontFamily.bold,
      fontSize: 24,
      lineHeight: 29, // ~120% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    h3: {
      fontFamily: fontFamily.semiBold,
      fontSize: 20,
      lineHeight: 24, // ~120% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    h4: {
      fontFamily: fontFamily.semiBold,
      fontSize: 18,
      lineHeight: 22, // ~120% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    h5: {
      fontFamily: fontFamily.medium,
      fontSize: 16,
      lineHeight: 19, // ~120% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
  },
  body: {
    large: {
      fontFamily: fontFamily.regular,
      fontSize: 18,
      lineHeight: 27, // ~150% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    medium: {
      fontFamily: fontFamily.regular,
      fontSize: 16,
      lineHeight: 24, // ~150% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    small: {
      fontFamily: fontFamily.regular,
      fontSize: 14,
      lineHeight: 21, // ~150% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    xsmall: {
      fontFamily: fontFamily.regular,
      fontSize: 12,
      lineHeight: 18, // ~150% line height
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
  },
  button: {
    large: {
      fontFamily: fontFamily.semiBold,
      fontSize: 18,
      lineHeight: 22, // Button line height tends to be tighter
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    medium: {
      fontFamily: fontFamily.semiBold,
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
    small: {
      fontFamily: fontFamily.semiBold,
      fontSize: 14,
      lineHeight: 17,
      letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
    },
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: Platform.OS === 'ios' ? 0.35 : undefined,
  },
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

// Helper function to get text style by name
export function getTextStyle(
  type: 'heading' | 'body' | 'button' | 'caption' | 'overline',
  variant?: string
) {
  if (type === 'heading' && variant) {
    return typography.heading[variant as keyof typeof typography.heading];
  }
  if (type === 'body' && variant) {
    return typography.body[variant as keyof typeof typography.body];
  }
  if (type === 'button' && variant) {
    return typography.button[variant as keyof typeof typography.button];
  }
  if (type === 'caption') {
    return typography.caption;
  }
  if (type === 'overline') {
    return typography.overline;
  }
  
  // Default
  return typography.body.medium;
}