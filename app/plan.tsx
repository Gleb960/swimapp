import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Lock, CheckCircle2 as CheckCircleIcon, CalendarDays, BookOpen } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Database } from '@/types/database.types'; // Import Database types

type LessonRow = Database['public']['Tables']['lessons']['Row'];

interface WeeklyPlanLesson extends LessonRow {
  locked?: boolean;
  completed?: boolean; // Ensure this is part of the type, even if from lesson_progress
  week_number_for_plan: number; // Added for robust handling
  order_in_week_for_plan: number; // Added for robust handling
  // Add other fields expected by the UI if not in LessonRow
  style?: string;
  type?: string;
  level?: string;
}

interface WeekData {
  week: number;
  title: string;
  description: string;
  lessons: WeeklyPlanLesson[];
}

// Mock data for weekly plan - REMOVE THIS OR KEEP FOR STRUCTURE REFERENCE
// const weeklyPlanMock = [...];

export default function PlanScreen() {
  const router = useRouter();
  const [weeklyPlan, setWeeklyPlan] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessLessons = async () => {
      try {
        setLoading(true);
        // TODO: Fetch lesson_progress as well to determine 'completed' status accurately
        const lessonsFromApi: LessonRow[] = await api.lessons.list();

        const groupedByWeek: { [key: number]: WeeklyPlanLesson[] } = {};
        lessonsFromApi.forEach(lesson => {
          // Use type assertion for fields not in LessonRow, with fallbacks
          const lessonWeek = (lesson as any).week || 1; // Default to week 1 if not present
          const lessonOrder = (lesson as any).order_in_week || 0; // Default order 0

          if (!groupedByWeek[lessonWeek]) {
            groupedByWeek[lessonWeek] = [];
          }
          
          groupedByWeek[lessonWeek].push({
            ...lesson,
            // Provide defaults for fields potentially missing or not in LessonRow
            style: (lesson as any).style || 'Техника',
            type: (lesson as any).type || 'Общее',
            level: (lesson as any).level || 'Начинающий',
            locked: (lesson as any).locked !== undefined ? (lesson as any).locked : true, // Default to locked
            completed: (lesson as any).completed || false, // Default to not completed, ideally from lesson_progress
            week_number_for_plan: lessonWeek,
            order_in_week_for_plan: lessonOrder,
          } as WeeklyPlanLesson);
        });

        const weekMeta: { [key: number]: { title: string; description: string } } = {
          1: { title: 'Знакомство с водой', description: 'Базовые упражнения для освоения в воде' },
          2: { title: 'Скольжение в воде', description: 'Учимся правильно скользить и работать ногами' },
          3: { title: 'Работа ног', description: 'Совершенствуем технику работы ног' },
          4: { title: 'Работа рук', description: 'Изучаем технику работы рук' },
          5: { title: 'Координация движений', description: 'Соединяем работу рук и ног' },
          6: { title: 'Дыхание в кроле', description: 'Совершенствуем технику дыхания' },
          7: { title: 'Повороты и старты', description: 'Изучаем технику поворотов и стартов' },
          8: { title: 'Закрепление навыков', description: 'Финальное закрепление всех элементов' },
        };

        const newWeeklyPlan: WeekData[] = Object.keys(groupedByWeek)
          .map(weekNumStr => parseInt(weekNumStr, 10))
          .sort((a, b) => a - b)
          .map(weekNum => ({
            week: weekNum,
            title: weekMeta[weekNum]?.title || `Неделя ${weekNum}`,
            description: weekMeta[weekNum]?.description || 'Описание недели отсутствует.',
            lessons: groupedByWeek[weekNum].sort((a, b) => a.order_in_week_for_plan - b.order_in_week_for_plan),
          }));

        setWeeklyPlan(newWeeklyPlan);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch or process plan data:', err);
        setError('Не удалось загрузить план обучения. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessLessons();
  }, []);

  const handleLessonPress = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Card onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.neutral[600]} />
        </Card>
        <Text style={styles.screenTitle}>Мой план</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card style={styles.introCard}>
          <Text style={styles.introTitle}>План обучения на 2 месяца</Text>
          <Text style={styles.introDescription}>
            Персональный план разработан для эффективного обучения плаванию. 
            Рекомендуется выполнять 2 тренировки в неделю для достижения оптимальных результатов.
          </Text>
          <View style={styles.progressInfo}>
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>8</Text>
              <Text style={styles.progressLabel}>недель</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>16</Text>
              <Text style={styles.progressLabel}>уроков</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressValue}>1/16</Text>
              <Text style={styles.progressLabel}>пройдено</Text>
            </View>
          </View>
        </Card>

        {loading && (
          <View style={styles.centeredMessageContainer}>
            <Text style={styles.messageText}>Загрузка плана...</Text>
          </View>
        )}
        {!loading && error && (
          <View style={styles.centeredMessageContainer}>
            <Text style={[styles.messageText, styles.errorText]}>{error}</Text>
          </View>
        )}
        {!loading && !error && weeklyPlan.length === 0 && (
          <View style={styles.centeredMessageContainer}>
            <Text style={styles.messageText}>План обучения пока пуст.</Text>
          </View>
        )}
        {!loading && !error && weeklyPlan.map((week, index) => (
          <View key={week.week} style={styles.weekContainer}>
            <View style={styles.weekHeader}>
              <View style={styles.weekTitleContainer}>
                <Calendar size={20} color={colors.primary[500]} />
                <View style={styles.weekTitleContent}>
                  <Text style={styles.weekTitle}>Неделя {week.week}</Text>
                  <Text style={styles.weekDescription}>{week.description}</Text>
                </View>
              </View>
              <Badge
                label={`${week.lessons.filter(l => l.completed).length}/${week.lessons.length}`}
                variant={week.lessons.some(l => l.completed) ? "success" : "primary"}
                size="small"
              />
            </View>

            {week.lessons.map((lesson) => (
              <View key={lesson.id} style={styles.lessonItemContainer}>
                <Card 
                  onPress={() => !lesson.locked && handleLessonPress(lesson.id.toString())}
                  style={[styles.lessonCard, lesson.locked && styles.lockedLessonCard]}
                >
                  <Image 
                    source={{ uri: lesson.thumbnail_url || 'https://via.placeholder.com/150?text=No+Image' }} // Use thumbnail_url
                    style={styles.lessonThumbnail} 
                  />
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
                    <Text style={styles.lessonDuration}>{lesson.duration} мин</Text>
                    <View style={styles.lessonBadges}>
                      {lesson.level && <Badge label={lesson.level} variant="primary" size="small" />}
                      {lesson.style && <Badge label={lesson.style} variant="secondary" size="small" style={{ marginLeft: spacing.x1 }}/>}
                    </View>
                  </View>
                  <View style={styles.lessonAction}>
                    {lesson.locked ? (
                      <Lock size={20} color={colors.neutral[400]} />
                    ) : lesson.completed ? (
                      <CheckCircleIcon size={24} color={colors.success[500]} />
                    ) : (
                      <ChevronRight size={24} color={colors.primary[500]} />
                    )}
                  </View>
                </Card>
              </View>
            ))}
          </View>
        ))}
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
  },
  backButton: {
    padding: spacing.x2,
    marginRight: spacing.x3,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.x4,
  },
  screenTitle: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginLeft: spacing.x2,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.x4,
    minHeight: 200, // Ensure it takes some space
  },
  messageText: {
    ...getTextStyle('body', 'large'),
    color: colors.neutral[600],
    textAlign: 'center',
  },
  errorText: {
    color: colors.error[500],
  },
  container: {
    flex: 1,
  },
  introCard: {
    marginBottom: spacing.x6,
    backgroundColor: colors.primary[50],
  },
  introTitle: {
    ...getTextStyle('heading', 'h3'),
    color: colors.primary[900],
    marginBottom: spacing.x2,
  },
  introDescription: {
    ...getTextStyle('body', 'medium'),
    color: colors.primary[700],
    marginBottom: spacing.x4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.medium,
    padding: spacing.x3,
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressValue: {
    ...getTextStyle('heading', 'h3'),
    color: colors.primary[700],
  },
  progressLabel: {
    ...getTextStyle('body', 'small'),
    color: colors.primary[600],
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.primary[200],
  },
  weekContainer: {
    marginBottom: spacing.x6,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.x3,
  },
  weekTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacing.x2,
  },
  weekTitleContent: {
    marginLeft: spacing.x2,
  },
  weekTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
  },
  weekDescription: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    marginTop: spacing.x1,
  },
  lessonCard: {
    marginBottom: spacing.x3,
    padding: 0,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.7,
  },
  lessonImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  lessonContent: {
    padding: spacing.x4,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.x2,
  },
  lessonTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.x2,
  },
  lessonTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
    flex: 1,
  },
  lessonDescription: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    marginBottom: spacing.x3,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[500],
    marginLeft: spacing.x1,
  },
});