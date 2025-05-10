import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/constants/colors';
import { getTextStyle } from '@/constants/typography';
import { spacing, layout } from '@/constants/spacing';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) {
  // Resolve button height based on size
  const buttonHeight = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 56;
      case 'medium':
      default:
        return 48;
    }
  };

  // Dynamically create button styles based on props
  const buttonStyles: ViewStyle[] = [
    styles.button,
    { height: buttonHeight() },
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    disabled && styles[`${variant}Disabled`],
    style as ViewStyle,
  ];

  // Dynamically create text styles based on props
  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary[500]}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: layout.borderRadius.medium,
    paddingHorizontal: spacing.x4,
    gap: spacing.x2,
  },
  text: {
    textAlign: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary[500],
  },
  primaryText: {
    color: colors.white,
    ...getTextStyle('button', 'medium'),
  },
  primaryDisabled: {
    backgroundColor: colors.primary[200],
  },
  
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  secondaryText: {
    color: colors.white,
    ...getTextStyle('button', 'medium'),
  },
  secondaryDisabled: {
    backgroundColor: colors.secondary[200],
  },
  
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  outlineText: {
    color: colors.primary[500],
    ...getTextStyle('button', 'medium'),
  },
  outlineDisabled: {
    borderColor: colors.neutral[400],
  },
  
  ghost: {
    backgroundColor: colors.transparent,
  },
  ghostText: {
    color: colors.primary[500],
    ...getTextStyle('button', 'medium'),
  },
  ghostDisabled: {
    backgroundColor: colors.transparent,
  },
  
  // Sizes
  small: {
    paddingHorizontal: spacing.x3,
  },
  smallText: {
    ...getTextStyle('button', 'small'),
  },
  
  medium: {
    paddingHorizontal: spacing.x4,
  },
  mediumText: {
    ...getTextStyle('button', 'medium'),
  },
  
  large: {
    paddingHorizontal: spacing.x6,
  },
  largeText: {
    ...getTextStyle('button', 'large'),
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: colors.neutral[500],
  },
});