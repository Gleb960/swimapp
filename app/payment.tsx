import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Shield, Clock, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const monthlyPrice = 14.99;
const annualPrice = monthlyPrice * 12 * 0.7; // 30% discount
const annualSavings = monthlyPrice * 12 - annualPrice;

const features = [
  'Доступ ко всем тренировкам и урокам',
  'Персональный AI-тренер',
  'Детальная аналитика прогресса',
  'Синхронизация с умными часами',
  'Без рекламы',
];

export default function PaymentScreen() {
  const router = useRouter();

  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    // Implement payment logic
    console.log(`Subscribing to ${plan} plan`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Card onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.neutral[600]} />
        </Card>
        <Text style={styles.title}>Подписка</Text>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg' }}
          style={styles.heroImage}
        />

        <View style={styles.plansContainer}>
          <Card style={[styles.planCard, styles.monthlyCard]}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Месячная подписка</Text>
              <View style={styles.trialBadge}>
                <Clock size={16} color={colors.success[600]} />
                <Text style={styles.trialText}>7 дней бесплатно</Text>
              </View>
            </View>
            
            <Text style={styles.price}>
              ${monthlyPrice}
              <Text style={styles.period}>/месяц</Text>
            </Text>
            
            <Button
              title="Попробовать бесплатно"
              size="large"
              onPress={() => handleSubscribe('monthly')}
              style={styles.subscribeButton}
            />
          </Card>

          <Card style={[styles.planCard, styles.annualCard]}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Годовая подписка</Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Экономия ${annualSavings.toFixed(2)}</Text>
              </View>
            </View>
            
            <Text style={styles.price}>
              ${(annualPrice / 12).toFixed(2)}
              <Text style={styles.period}>/месяц</Text>
            </Text>
            <Text style={styles.annualTotal}>
              ${annualPrice.toFixed(2)} в год
            </Text>
            
            <Button
              title="Выбрать годовую"
              size="large"
              variant="secondary"
              onPress={() => handleSubscribe('annual')}
              style={styles.subscribeButton}
            />
          </Card>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Что включено</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={20} color={colors.success[500]} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.securityInfo}>
          <Shield size={20} color={colors.neutral[600]} />
          <Text style={styles.securityText}>
            Безопасная оплата через Stripe. Отменить подписку можно в любой момент.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.x4,
    paddingTop: Platform.OS === 'android' ? spacing.x8 : spacing.x4,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  backButton: {
    padding: spacing.x2,
    marginRight: spacing.x3,
  },
  title: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.x4,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: layout.borderRadius.medium,
    marginBottom: spacing.x6,
  },
  plansContainer: {
    gap: spacing.x4,
    marginBottom: spacing.x6,
  },
  planCard: {
    padding: spacing.x4,
  },
  monthlyCard: {
    backgroundColor: colors.white,
  },
  annualCard: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.secondary[200],
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.x2,
  },
  planTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success[50],
    paddingVertical: spacing.x1,
    paddingHorizontal: spacing.x2,
    borderRadius: layout.borderRadius.medium,
    gap: spacing.x1,
  },
  trialText: {
    ...getTextStyle('caption'),
    color: colors.success[700],
  },
  savingsBadge: {
    backgroundColor: colors.secondary[100],
    paddingVertical: spacing.x1,
    paddingHorizontal: spacing.x2,
    borderRadius: layout.borderRadius.medium,
  },
  savingsText: {
    ...getTextStyle('caption'),
    color: colors.secondary[700],
  },
  price: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x1,
  },
  period: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
  },
  annualTotal: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    marginBottom: spacing.x4,
  },
  subscribeButton: {
    marginTop: spacing.x2,
  },
  featuresSection: {
    marginBottom: spacing.x6,
  },
  featuresTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
    marginBottom: spacing.x4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.x3,
    gap: spacing.x3,
  },
  featureText: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[800],
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    padding: spacing.x4,
    borderRadius: layout.borderRadius.medium,
    gap: spacing.x3,
  },
  securityText: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    flex: 1,
  },
});