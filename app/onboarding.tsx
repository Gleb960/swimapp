import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  type: 'text' | 'email' | 'single' | 'multiple';
  options?: string[];
  optional?: boolean;
  illustration?: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'name',
    title: 'Как вас зовут?',
    description: 'Это поможет нам персонализировать ваш опыт',
    type: 'text',
    illustration: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
  },
  {
    id: 'goals',
    title: 'Зачем вы хотите заниматься плаванием?',
    description: 'Можно выбрать несколько вариантов',
    type: 'multiple',
    options: [
      'Хочу научиться плавать',
      'Для здоровья и общего самочувствия',
      'Улучшить технику',
      'Повысить выносливость',
      'Готовлюсь к соревнованиям / заплыву',
      'Просто для удовольствия',
    ],
    illustration: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
  },
  {
    id: 'level',
    title: 'Какой у вас уровень плавания?',
    description: 'Это поможет нам подобрать подходящую программу',
    type: 'single',
    options: [
      'Могу проплыть только 25–50 м, делаю паузы',
      'Плаваю несколько бассейнов по 25 м',
      'Проплываю свыше 500 м за тренировку',
      'Проплываю больше 1 км за тренировку',
    ],
    illustration: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
  },
  {
    id: 'frequency',
    title: 'Сколько раз в неделю вы планируете тренироваться?',
    description: 'Мы составим оптимальный график тренировок',
    type: 'single',
    options: [
      '1 раз',
      '2 раза',
      '3 раза',
      '4 раза',
      '5+ раз',
    ],
    illustration: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
  },
  {
    id: 'equipment',
    title: 'Какое оборудование у вас есть?',
    description: 'Выберите всё, что у вас есть',
    type: 'multiple',
    options: [
      'Ласты',
      'Доска',
      'Колобашка',
      'Лопатки',
      'Трубка',
      'Ничего из этого',
    ],
    illustration: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
  },
  {
    id: 'watch',
    title: 'Хотите подключить часы для трекинга?',
    description: 'Это поможет точнее отслеживать ваш прогресс',
    type: 'single',
    options: [
      'Apple Watch',
      'Garmin',
      'Другое',
      'Нет / подключу позже',
    ],
    illustration: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
  },
];

const initialAnswers = steps.reduce((acc, step) => ({
  ...acc,
  [step.id]: step.type === 'multiple' ? [] : '',
}), {});

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const { session } = useAuth();
  
  const step = steps[currentStep];
  
  const handleTextInput = (text: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: text }));
  };
  
  const handleSingleSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: option }));
    if (currentStep < steps.length - 1) {
      setTimeout(() => handleNext(), 300);
    }
  };
  
  const handleMultipleSelect = (option: string) => {
    const currentSelection = (answers[step.id] as string[]) || [];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter(item => item !== option)
      : [...currentSelection, option];
    setAnswers(prev => ({ ...prev, [step.id]: newSelection }));
  };
  
  const isOptionSelected = (option: string) => {
    const answer = answers[step.id];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return answer === option;
  };
  
  const canProceed = () => {
    const answer = answers[step.id];
    if (step.optional) return true;
    if (step.type === 'text' || step.type === 'email') {
      return !!answer && typeof answer === 'string' && answer.trim().length > 0;
    }
    if (step.type === 'single') {
      return !!answer;
    }
    if (step.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return false;
  };
  
  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      console.log('Onboarding completed:', answers);
      try {
        if (session && session.user) {
          const name = answers.name as string;
          const email = session.user.email;
          const profileData: any = {
            full_name: name,
            email,
            goals: answers.goals,
            level: answers.level,
            frequency: answers.frequency,
            equipment: answers.equipment,
            watch: answers.watch,
          };
          await api.profiles.update(profileData);
          console.log('Profile updated successfully');
        }
      } catch (error) {
        console.error('Failed to update profile:', error);
        // Optionally, show an error message to the user
      }
      router.push('/(tabs)');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
      return;
    }
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSkip = () => {
    handleNext();
  };
  
  const renderInput = () => {
    switch (step.type) {
      case 'text':
      case 'email':
        return (
          <Card style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              value={answers[step.id] as string}
              onChangeText={handleTextInput}
              placeholder={step.type === 'email' ? 'example@email.com' : 'Введите имя'}
              keyboardType={step.type === 'email' ? 'email-address' : 'default'}
              autoCapitalize={step.type === 'email' ? 'none' : 'words'}
              autoComplete={step.type === 'email' ? 'email' : 'name'}
              placeholderTextColor={colors.neutral[400]}
            />
          </Card>
        );
      
      case 'single':
      case 'multiple':
        return (
          <View style={styles.optionsContainer}>
            {step.options?.map((option, index) => (
              <Card
                key={option}
                style={[
                  styles.optionCard,
                  isOptionSelected(option) && styles.selectedOptionCard,
                ]}
                onPress={() => step.type === 'single' 
                  ? handleSingleSelect(option)
                  : handleMultipleSelect(option)
                }
              >
                <Text style={[
                  styles.optionText,
                  isOptionSelected(option) && styles.selectedOptionText,
                ]}>
                  {option}
                </Text>
                
                {isOptionSelected(option) && (
                  <View style={styles.checkmark}>
                    <Check size={16} color={colors.white} />
                  </View>
                )}
              </Card>
            ))}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Card onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.neutral[600]} />
        </Card>
        
        <View style={styles.progress}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.activeProgressDot,
                index < currentStep && styles.completedProgressDot,
              ]}
            />
          ))}
        </View>
        
        {step.optional && (
          <Button
            title="Пропустить"
            variant="ghost"
            size="small"
            onPress={handleSkip}
          />
        )}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepContent}>
          <Text style={styles.stepIndicator}>
            Шаг {currentStep + 1} из {steps.length}
          </Text>
          <Text style={styles.title}>{step.title}</Text>
          {step.description && (
            <Text style={styles.description}>{step.description}</Text>
          )}
          
          {renderInput()}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={currentStep === steps.length - 1 ? "Начать тренировки" : "Продолжить"}
          size="large"
          disabled={!canProceed()}
          onPress={handleNext}
          style={styles.nextButton}
          rightIcon={currentStep === steps.length - 1 ? undefined : <ArrowRight size={20} color={colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.x2,
    marginHorizontal: spacing.x4,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral[200],
  },
  activeProgressDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
  },
  completedProgressDot: {
    backgroundColor: colors.primary[300],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.x4,
    paddingTop: spacing.x12,
  },
  stepContent: {
    flex: 1,
    marginTop: spacing.x8,
  },
  stepIndicator: {
    ...getTextStyle('body', 'small'),
    color: colors.primary[500],
    marginBottom: spacing.x4,
    fontFamily: 'Inter-Medium',
  },
  title: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x4,
  },
  description: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    marginBottom: spacing.x6,
  },
  inputCard: {
    marginTop: spacing.x4,
    borderWidth: 2,
    borderColor: colors.neutral[200],
  },
  textInput: {
    ...getTextStyle('body', 'large'),
    color: colors.neutral[900],
    height: 64,
    paddingHorizontal: spacing.x4,
  },
  optionsContainer: {
    marginTop: spacing.x4,
    gap: spacing.x3,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.x4,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    backgroundColor: colors.white,
  },
  selectedOptionCard: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  optionText: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[900],
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: spacing.x4,
    paddingBottom: Platform.OS === 'ios' ? spacing.x8 : spacing.x4,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  nextButton: {
    alignSelf: 'stretch',
  },
});