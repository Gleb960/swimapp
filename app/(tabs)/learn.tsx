import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Platform, ScrollView, Image } from 'react-native';
import { Search, Filter as FilterIcon, Play, Clock, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Database } from '@/types/database.types';

type LessonRow = Database['public']['Tables']['lessons']['Row'];

// Define a more specific type for lessons displayed in this screen
interface DisplayLesson extends LessonRow {
  style: string;
  type: string;
  level: string;
  progress: number;
  lessons?: Array<{ title: string; duration: number; description: string }>; // For potential sub-lessons, matching mock data structure
  // Ensure all fields used in renderLessonItem are covered here or in LessonRow
}

// Filter categories
const SWIMMING_STYLES = [
  { id: 'freestyle', label: 'Кроль', color: colors.primary[500] },
  { id: 'backstroke', label: 'Спина', color: colors.secondary[500] },
  { id: 'breaststroke', label: 'Брасс', color: colors.accent[500] },
  { id: 'butterfly', label: 'Дельфин', color: colors.warning[500] },
];

const TRAINING_TYPES = [
  { id: 'endurance', label: 'Выносливость', color: colors.success[500] },
  { id: 'technique', label: 'Техника', color: colors.primary[500] },
  { id: 'speed', label: 'Скорость', color: colors.error[500] },
  { id: 'breathing', label: 'Дыхание', color: colors.secondary[500] },
  { id: 'turns', label: 'Повороты', color: colors.accent[500] },
];

const LEVELS = [
  { id: 'beginner', label: 'Начинающий', color: colors.success[500] },
  { id: 'intermediate', label: 'Средний', color: colors.warning[500] },
  { id: 'advanced', label: 'Продвинутый', color: colors.error[500] },
];

// Mock data for lessons - REMOVE THIS
// const lessons = [
//   {
//     id: '1',
//     title: 'Основы дыхания и скольжения',
//     description: 'Научимся правильно дышать в воде и освоим базовые упражнения скольжения',
//     duration: 30,
//     level: 'Начинающий',
//     style: 'Техника',
//     type: 'Дыхание',
//     thumbnail: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
//     progress: 0,
//     lessons: [
//       {
//         title: 'Дыхание в воде',
//         duration: 10,
//         description: 'Освоение правильной техники дыхания'
//       },
//       {
//         title: 'Скольжение',
//         duration: 10,
//         description: 'Техника скольжения в воде'
//       },
//       {
//         title: 'Баланс',
//         duration: 10,
//         description: 'Упражнения на баланс в воде'
//       }
//     ]
//   },
//   {
//     id: '2',
//     title: 'Работа ног',
//     description: 'Освоим технику работы ног при плавании кролем',
//     duration: 30,
//     level: 'Начинающий',
//     style: 'Кроль',
//     type: 'Техника',
//     thumbnail: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
//     progress: 0,
//   }
// ];

export default function LearnScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [allLessons, setAllLessons] = useState<DisplayLesson[]>([]); // Use DisplayLesson type
  const [filteredLessons, setFilteredLessons] = useState<DisplayLesson[]>([]); // Use DisplayLesson type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const lessonsData: LessonRow[] = await api.lessons.list();
        
        const adaptedLessons: DisplayLesson[] = lessonsData.map((lesson: LessonRow) => ({
          ...lesson,
          // Provide defaults for fields not in LessonRow or potentially missing from API
          // These fields (style, type, level) should ideally be part of the 'lessons' table in Supabase
          style: (lesson as any).style || 'Техника',
          type: (lesson as any).type || 'Дыхание',
          level: (lesson as any).level || 'Начинающий',
          // Progress should ideally be calculated based on 'lesson_progress' table
          progress: (lesson as any).progress || 0,
          // 'lessons' (sub-lessons) are not in the DB schema for the 'lessons' table.
          // If this feature is needed, it requires DB schema changes or different data fetching.
          lessons: (lesson as any).lessons || [], 
        }));
        setAllLessons(adaptedLessons);
        setFilteredLessons(adaptedLessons);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
        setError('Не удалось загрузить уроки. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);
  
  const toggleFilter = (filterId: string) => {
    setSelectedFilters(current =>
      current.includes(filterId)
        ? current.filter(id => id !== filterId)
        : [...current, filterId]
    );
  };
  
  const applyFilters = useCallback(() => {
    let filtered = allLessons; // Use allLessons from state
    
    if (searchQuery) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lesson.description && lesson.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lesson.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.level.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(lesson =>
        selectedFilters.some(filter =>
          lesson.style.toLowerCase().includes(filter.toLowerCase()) ||
          lesson.type.toLowerCase().includes(filter.toLowerCase()) ||
          lesson.level.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
    
    setFilteredLessons(filtered);
  }, [searchQuery, selectedFilters, allLessons]); // Add allLessons to dependencies
  
  React.useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedFilters, applyFilters]);
  
  const renderFilterSection = (title: string, filters: typeof SWIMMING_STYLES) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => toggleFilter(filter.label)}
              style={[
                styles.filterChip,
                selectedFilters.includes(filter.label) && {
                  backgroundColor: filter.color,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilters.includes(filter.label) && styles.filterChipTextSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
  
  const handleLessonPress = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };
  
  const renderLessonItem = ({ item }: { item: DisplayLesson }) => (
    <Card onPress={() => handleLessonPress(item.id.toString())} style={styles.lessonCard}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/300x200.png?text=No+Image' }} // Use thumbnail_url
          style={styles.thumbnail}
        />
        <View style={styles.thumbnailOverlay} />
        
        <View style={styles.lessonMeta}>
          <View style={styles.durationBadge}>
            <Clock size={14} color={colors.white} />
            <Text style={styles.durationText}>{item.duration} мин</Text>
          </View>
          
          {item.progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.lessonContent}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <ChevronRight size={20} color={colors.neutral[400]} />
        </View>
        
        <Text style={styles.lessonDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          <Badge
            label={item.level} // No need for 'as string' if DisplayLesson.level is string
            variant="primary"
            size="small"
            style={styles.tag}
          />
          <Badge
            label={item.style} // No need for 'as string'
            variant="secondary"
            size="small"
            style={styles.tag}
          />
          <Badge
            label={item.type} // No need for 'as string'
            variant="accent"
            size="small"
            style={styles.tag}
          />
        </View>

        {/* Render sub-lessons if they exist on the item */}
        {item.lessons && Array.isArray(item.lessons) && item.lessons.length > 0 && (
          <View style={styles.miniLessons}>
            {item.lessons.map((subLesson, index) => (
              <View key={index} style={styles.miniLesson}>
                <View style={styles.miniLessonDot} />
                <View style={styles.miniLessonContent}>
                  <Text style={styles.miniLessonTitle}>{subLesson.title}</Text>
                  <Text style={styles.miniLessonDuration}>{subLesson.duration} мин</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Обучение</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.neutral[400]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск уроков"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.neutral[400]}
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={20} color={showFilters ? colors.white : colors.neutral[600]} />
          </TouchableOpacity>
        </View>
        
        {showFilters && (
          <View style={styles.filtersContainer}>
            {renderFilterSection('Стили плавания', SWIMMING_STYLES)}
            {renderFilterSection('Тип тренировки', TRAINING_TYPES)}
            {renderFilterSection('Уровень', LEVELS)}
          </View>
        )}
        
        <FlatList
          data={filteredLessons}
          renderItem={renderLessonItem}
          keyExtractor={(item) => item.id.toString()} // Ensure key is string
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Уроки не найдены</Text>
              <Text style={styles.emptyDescription}>
                Попробуйте изменить параметры поиска или фильтры
              </Text>
            </View>
          }
        />
      </View>
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
    padding: spacing.x4,
    paddingTop: Platform.OS === 'android' ? spacing.x8 : spacing.x4,
  },
  screenTitle: {
    ...getTextStyle('heading', 'h2'),
    color: colors.neutral[900],
    marginBottom: spacing.x4,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: spacing.x4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.medium,
    paddingHorizontal: spacing.x3,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginRight: spacing.x2,
  },
  searchIcon: {
    marginRight: spacing.x2,
  },
  searchInput: {
    flex: 1,
    height: 48,
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[800],
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filtersContainer: {
    marginBottom: spacing.x4,
  },
  filterSection: {
    marginBottom: spacing.x4,
  },
  filterSectionTitle: {
    ...getTextStyle('heading', 'h5'),
    color: colors.neutral[700],
    marginBottom: spacing.x2,
    marginLeft: spacing.x1,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.x1,
  },
  filterChip: {
    paddingHorizontal: spacing.x3,
    paddingVertical: spacing.x2,
    borderRadius: layout.borderRadius.medium,
    backgroundColor: colors.white,
    marginRight: spacing.x2,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  filterChipText: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[700],
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  listContent: {
    paddingBottom: spacing.x4,
  },
  lessonCard: {
    marginBottom: spacing.x3,
    padding: 0,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.neutral[900],
    opacity: 0.3,
  },
  lessonMeta: {
    position: 'absolute',
    top: spacing.x3,
    left: spacing.x3,
    right: spacing.x3,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: spacing.x1,
    paddingHorizontal: spacing.x2,
    borderRadius: layout.borderRadius.medium,
    alignSelf: 'flex-start',
  },
  durationText: {
    ...getTextStyle('caption'),
    color: colors.white,
    marginLeft: spacing.x1,
  },
  progressContainer: {
    position: 'absolute',
    bottom: -spacing.x3,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.neutral[200],
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
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
  lessonTitle: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[900],
    flex: 1,
  },
  lessonDescription: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    marginBottom: spacing.x3,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.x3,
  },
  tag: {
    marginRight: spacing.x2,
    marginBottom: spacing.x1,
  },
  miniLessons: {
    marginTop: spacing.x3,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    paddingTop: spacing.x3,
  },
  miniLesson: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.x2,
  },
  miniLessonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
    marginRight: spacing.x2,
  },
  miniLessonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniLessonTitle: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[700],
  },
  miniLessonDuration: {
    ...getTextStyle('caption'),
    color: colors.neutral[500],
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.x8,
  },
  emptyText: {
    ...getTextStyle('heading', 'h4'),
    color: colors.neutral[600],
    marginBottom: spacing.x2,
  },
  emptyDescription: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[500],
    textAlign: 'center',
  },
});