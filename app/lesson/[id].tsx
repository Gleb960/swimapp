import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Clock, Play, CircleCheck as CheckCircle2, Target, Flame, Wind } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Database } from '@/types/database.types';

type LessonRow = Database['public']['Tables']['lessons']['Row'];

interface LessonSection {
  title: string;
  type: string; // 'warmup', 'main', 'cooldown'
  content: string;
  image?: string; // Optional, as mock data had it
  completed: boolean;
}

interface LessonDetailType extends LessonRow {
  sections: LessonSection[];
  progress: number; // Calculated or from API
  // Ensure all fields used in render are covered
}

// Mock lesson data - REMOVE THIS
// const lessonData = { ... };

const getSectionIcon = (type: string) => {
  switch (type) {
    case 'warmup':
      return <Flame size={20} color={colors.warning[500]} />;
    case 'main':
      return <Target size={20} color={colors.primary[500]} />;
    case 'cooldown':
      return <Wind size={20} color={colors.secondary[500]} />;
    default:
      return null;
  }
};

const getSectionColor = (type: string) => {
  switch (type) {
    case 'warmup':
      return colors.warning[500];
    case 'main':
      return colors.primary[500];
    case 'cooldown':
      return colors.secondary[500];
    default:
      return colors.neutral[500];
  }
};

const getSectionLabel = (type: string) => {
  switch (type) {
    case 'warmup':
      return 'Разминка';
    case 'main':
      return 'Основная часть';
    case 'cooldown':
      return 'Заключение';
    default:
      return '';
  }
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      if (id && typeof id === 'string') {
        try {
          setLoading(true);
          const lessonDataFromApi = await api.lessons.get(id);

          // Adapt the API data to LessonDetailType
          // The 'sections' field is not in the 'lessons' table schema in database.types.ts.
          // If 'sections' are stored as JSONB in Supabase, they might be on lessonDataFromApi.
          // Otherwise, this will default to an empty array.
          // 'progress' also needs to be sourced or calculated.
          const sectionsFromApi = (lessonDataFromApi as any).sections;
          const adaptedLesson: LessonDetailType = {
            ...lessonDataFromApi,
            // Ensure sections is an array of LessonSection, provide a default if it's not or is undefined
            sections: Array.isArray(sectionsFromApi) 
              ? sectionsFromApi.map((s: any) => ({ // Map to ensure structure matches LessonSection
                  title: s.title || 'Без названия',
                  type: s.type || 'main',
                  content: s.content || '',
                  image: s.image,
                  completed: s.completed || false,
                })) 
              : [], 
            // Progress should be calculated based on completed sections or fetched from lesson_progress table.
            // For now, defaulting or trying to get from API response.
            progress: (lessonDataFromApi as any).progress || 0, 
          };
          setLesson(adaptedLesson);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch lesson:', err);
          setError('Не удалось загрузить урок. Пожалуйста, попробуйте позже.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Неверный ID урока.');
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.loadingText}>Загрузка урока...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Вернуться назад"
            onPress={() => router.push('/(tabs)/learn')}
            style={{ marginTop: spacing.x4 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredMessageContainer}> // Changed from styles.container to ensure centering
          <Text>Урок не найден</Text>
          <Button 
            title="Вернуться назад"
            onPress={() => router.push('/(tabs)/learn')}
            style={{ marginTop: spacing.x4 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleSectionComplete = () => {
    if (lesson && activeSection === lesson.sections.length - 1) {
      const updatedSections = lesson.sections.map(section => ({
        ...section,
        completed: true,
      }));
      // Update lesson_progress via API
      api.lessonProgress.complete(lesson.id.toString()).catch(err => console.error('Failed to complete lesson progress', err));
      setLesson({ ...lesson, sections: updatedSections, progress: 100 });
    }
  };

  const handleBack = () => {
    router.push('/(tabs)/learn');
  };

  const completedSections = lesson.sections.filter(s => s.completed).length;
  const progress = lesson.sections.length > 0 ? (completedSections / lesson.sections.length) * 100 : 0;
  // Update lesson's progress state if it's different from calculated, though this might cause re-renders.
  // useEffect(() => {
  //   if (lesson && lesson.progress !== progress) {
  //     setLesson(prevLesson => prevLesson ? ({ ...prevLesson, progress }) : null);
  //   }
  // }, [progress, lesson]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Card onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.neutral[600]} />
          </Card>
          <View style={styles.duration}>
            <Clock size={16} color={colors.neutral[500]} />
            <Text style={styles.durationText}>{lesson.duration} мин</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{lesson.title}</Text>
          {lesson.description && <Text style={styles.description}>{lesson.description}</Text>}
        </View>

        <Card style={styles.videoCard}>
          <Image
            source={{ uri: lesson.thumbnail_url || 'https://via.placeholder.com/300x200.png?text=No+Image' }} // Use thumbnail_url
            style={styles.thumbnail}
          />
          <View style={styles.videoOverlay}>
            <Button
              title="Смотреть видео"
              onPress={() => {}}
              variant="primary"
              size="large"
              leftIcon={<Play size={20} color={colors.white} fill={colors.white} />}
            />
          </View>
        </Card>

        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Этапы тренировки</Text>
          
          <View style={styles.sectionsList}>
            {lesson.sections.map((section, index) => (
              <Card 
                key={index}
                onPress={() => setActiveSection(index)}
                style={[
                  styles.sectionCard,
                  activeSection === index && styles.activeSectionCard,
                ]}
              >
                <View style={styles.sectionHeader}>
                  {getSectionIcon(section.type)}
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.completed && (
                    <CheckCircle2 size={20} color={colors.success[500]} />
                  )}
                </View>
                {activeSection === index && (
                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionText}>{section.content}</Text>
                    {section.image && (
                      <Image source={{ uri: section.image }} style={styles.sectionImage} />
                    )}
                  </View>
                )}
              </Card>
            ))}
          </View>
        </View>

        {lesson.sections.length > 0 && activeSection < lesson.sections.length && (
          <Button
            title={activeSection === lesson.sections.length - 1 ? 'Завершить урок' : 'Следующий этап'}
            onPress={() => {
              if (activeSection < lesson.sections.length - 1) {
                setActiveSection(activeSection + 1);
              } else {
                handleSectionComplete();
              }
            }}
            style={styles.nextButton}
            disabled={!lesson.sections[activeSection] || lesson.sections[activeSection].completed}
          />
        )}
        {progress === 100 && (
            <Text style={styles.completedText}>Урок пройден!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.x4,
  },
  content: {
    paddingBottom: spacing.x8,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.x4,
  },
  loadingText: {
    ...getTextStyle('body', 'large'),
    color: colors.neutral[600],
  },
  errorText: {
    ...getTextStyle('body', 'large'),
    color: colors.error[500],
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.x4,
  },
  backButton: {
    padding: spacing.x2,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.x2,
    paddingHorizontal: spacing.x3,
    borderRadius: layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  durationText: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[500],
    marginLeft: spacing.x1,
  },
  titleSection: {
    marginBottom: spacing.x4,
  },
  title: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x2,
  },
  description: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
  },
  videoCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.x6,
  },
  thumbnail: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionsContainer: {
    marginBottom: spacing.x4,
  },
  sectionsTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
    marginBottom: spacing.x3,
  },
  sectionsList: {
    gap: spacing.x3,
  },
  sectionCard: {
    backgroundColor: colors.white,
  },
  activeSectionCard: {
    borderColor: colors.primary[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.x3,
  },
  sectionHeaderContent: {
    flex: 1,
  },
  sectionBadge: {
    marginBottom: spacing.x1,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
  },
  sectionContent: {
    marginTop: spacing.x4,
    paddingTop: spacing.x4,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  sectionText: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    lineHeight: 24,
  },
  imageCard: {
    padding: 0,
    overflow: 'hidden',
    marginTop: spacing.x4,
  },
  sectionImage: {
    width: '100%',
    height: 150,
    borderRadius: layout.borderRadius.medium,
    marginTop: spacing.x2,
  },
  nextButton: {
    marginTop: spacing.x4,
  },
  completedText: {
    ...getTextStyle('heading', 'h3'),
    color: colors.success[500],
    textAlign: 'center',
    marginTop: spacing.x4,
  }
});