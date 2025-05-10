import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, layout } from '@/constants/spacing';
import { getTextStyle } from '@/constants/typography';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const presetMessages = [
  {
    id: '1',
    question: 'Как прокачать выносливость?',
    answer: '🏊‍♂️ Для развития выносливости:\n\n• Регулярные тренировки\n• Постепенное увеличение нагрузки\n• Интервальное плавание'
  },
  {
    id: '2',
    question: 'Как научиться плавать на спине?',
    answer: '🌊 Основные этапы:\n\n• Освоение положения\n• Работа ног\n• Движения рук\n• Дыхание'
  },
  {
    id: '3',
    question: 'Я хочу научиться плавать, что делать?',
    answer: '👋 План для начинающих:\n\n• Освоение воды\n• Дыхание\n• Базовые упражнения\n• Техника'
  }
];

export default function TrainerScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Привет! Я помогу вам улучшить технику плавания. С чего начнем?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const flatListRef = useRef<FlatList>(null);
  
  const handleSendMessage = (text: string = message) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    
    const preset = presetMessages.find(p => p.question === text);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: preset ? preset.answer : getAIResponse(text),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };
  
  const getAIResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('кроль') || lowerCaseMessage.includes('фристайл')) {
      return '🏊‍♂️ Техника кроля:\n\n• Положение тела\n• Работа ног\n• Гребки руками\n• Дыхание';
    } else if (lowerCaseMessage.includes('дыхан')) {
      return '💨 Дыхание:\n\n• Выдох в воду\n• Быстрый вдох\n• Ритм дыхания';
    } else if (lowerCaseMessage.includes('техник')) {
      return '🎯 Упражнения:\n\n• "Поплавок"\n• "Стрелочка"\n• "Звёздочка"';
    } else {
      return 'Могу помочь с:\n\n• Техникой\n• Дыханием\n• Тренировками';
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
    ]}>
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <Avatar
            size={36}
            initials="T"
            backgroundColor={colors.primary[500]}
          />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText,
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestampText}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderPresetMessages = () => (
    <View style={styles.presetContainer}>
      <Text style={styles.presetTitle}>Популярные вопросы:</Text>
      {presetMessages.map((preset) => (
        <TouchableOpacity
          key={preset.id}
          style={styles.presetButton}
          onPress={() => handleSendMessage(preset.question)}
        >
          <Text style={styles.presetText}>{preset.question}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MessageSquare size={24} color={colors.primary[500]} />
            <Text style={styles.screenTitle}>Персональный тренер</Text>
          </View>
          <Text style={styles.subtitle}>Powered by AI</Text>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={messages.length === 1 ? renderPresetMessages : null}
        />
        
        <Card style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Задайте вопрос о плавании..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            placeholderTextColor={colors.neutral[400]}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.disabledSendButton,
            ]}
            onPress={() => handleSendMessage()}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? colors.white : colors.neutral[400]} />
          </TouchableOpacity>
        </Card>
      </KeyboardAvoidingView>
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
  header: {
    marginBottom: spacing.x4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.x1,
  },
  screenTitle: {
    ...getTextStyle('heading', 'h3'),
    color: colors.neutral[900],
    marginLeft: spacing.x2,
  },
  subtitle: {
    ...getTextStyle('body', 'small'),
    color: colors.neutral[600],
    marginLeft: spacing.x6 + spacing.x2,
  },
  messagesList: {
    paddingVertical: spacing.x2,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.x3,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: spacing.x2,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: layout.borderRadius.large,
    padding: spacing.x3,
    flexShrink: 1,
  },
  userMessageBubble: {
    backgroundColor: colors.primary[500],
  },
  aiMessageBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  messageText: {
    ...getTextStyle('body', 'medium'),
    flexShrink: 1,
  },
  userMessageText: {
    color: colors.white,
  },
  aiMessageText: {
    color: colors.neutral[800],
  },
  timestampText: {
    ...getTextStyle('caption'),
    color: colors.neutral[400],
    alignSelf: 'flex-end',
    marginTop: spacing.x1,
  },
  presetContainer: {
    marginTop: spacing.x4,
    marginBottom: spacing.x4,
  },
  presetTitle: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[600],
    marginBottom: spacing.x3,
  },
  presetButton: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.medium,
    padding: spacing.x3,
    marginBottom: spacing.x2,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  presetText: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[700],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.x3,
    marginTop: spacing.x2,
  },
  input: {
    ...getTextStyle('body', 'medium'),
    color: colors.neutral[800],
    flex: 1,
    maxHeight: 100,
    paddingVertical: spacing.x2,
    paddingHorizontal: spacing.x2,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.x2,
  },
  disabledSendButton: {
    backgroundColor: colors.neutral[200],
  },
});