import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Globe } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from './Card';

const languages = [
  { code: 'ru', name: 'Русский', short: 'RU' },
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'et', name: 'Eesti', short: 'ET' },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export default function LanguageSelector({ 
  currentLanguage = 'ru',
  onLanguageChange 
}: LanguageSelectorProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Globe size={20} color={colors.neutral[600]} />
        <Text style={styles.title}>Язык</Text>
      </View>
      
      <View style={styles.languagesContainer}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              currentLanguage === language.code && styles.activeLanguage,
            ]}
            onPress={() => onLanguageChange?.(language.code)}
          >
            <Text style={[
              styles.languageCode,
              currentLanguage === language.code && styles.activeLanguageText,
            ]}>
              {language.short}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: spacing.x3,
  },
  title: {
    ...getTextStyle('heading', 'h5'),
    color: colors.neutral[900],
    marginLeft: spacing.x2,
  },
  languagesContainer: {
    flexDirection: 'row',
    gap: spacing.x2,
  },
  languageButton: {
    paddingVertical: spacing.x2,
    paddingHorizontal: spacing.x3,
    borderRadius: layout.borderRadius.medium,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  activeLanguage: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
  },
  languageCode: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[700],
  },
  activeLanguageText: {
    color: colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
});