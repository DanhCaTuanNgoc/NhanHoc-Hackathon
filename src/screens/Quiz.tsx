/**
 * Quiz Screen
 * Màn hình làm bài quiz với UI cải tiến
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { colors } from '../constants/theme';
import { useQuiz } from '../hooks/useQuiz';

// Backend returns Vietnamese keys
interface QuizQuestionData {
  'câu hỏi': string;
  'các câu trả lời': string[];
  'đáp án đúng': number;
  'giải thích': string;
}

interface QuizScreenProps {
  route: {
    params: {
      course: string;
      topic: string;
      subtopic: string;
      description: string;
    };
  };
  navigation: any;
}

export default function Quiz({ route, navigation }: QuizScreenProps) {
  const { course, topic, subtopic, description } = route.params;
  const { createAndWait } = useQuiz();

  const [questions, setQuestions] = useState<QuizQuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setIsGenerating(true);

    try {
      const result = await createAndWait({
        course,
        topic,
        subtopic,
        description,
      });

      console.log('Quiz API result:', JSON.stringify(result, null, 2));

      if (result?.status === 'completed' && result.result?.questions) {
        const quizQuestions = result.result.questions;
        console.log('Quiz questions count:', quizQuestions.length);
        console.log('First question:', JSON.stringify(quizQuestions[0], null, 2));
        
        setQuestions(quizQuestions as any);
        setSelectedAnswers(new Array(quizQuestions.length).fill(null));
      } else {
        console.error('Quiz generation failed:', result);
        Alert.alert('Lỗi', 'Không thể tạo quiz. Vui lòng thử lại.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo quiz.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }

    setIsGenerating(false);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (showResults) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = selectedAnswers.filter((a) => a === null).length;

    if (unanswered > 0) {
      Alert.alert(
        'Chưa hoàn thành',
        `Bạn còn ${unanswered} câu chưa trả lời. Bạn có muốn nộp bài không?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Nộp bài', onPress: () => setShowResults(true) },
        ]
      );
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q['đáp án đúng']) {
        correct++;
      }
    });
    return correct;
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  if (isGenerating) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
        <AppHeader title="Đang tạo Quiz..." />
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Text className="text-lg font-bold text-center mb-2" style={{ color: '#0F172A' }}>
            Đang tạo câu hỏi...
          </Text>
          <Text className="text-sm text-center" style={{ color: '#64748B' }}>
            Vui lòng đợi trong giây lát
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
        <AppHeader title="Quiz" />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-lg font-bold text-center mt-4 mb-2" style={{ color: '#0F172A' }}>
            Không thể tải quiz
          </Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
            onPress={() => navigation.goBack()}
          >
            <Text className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
        <AppHeader title="Kết Quả" />
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Results Card */}
          <View className="px-6 pt-6 pb-4">
            <View
              className="rounded-2xl p-6 items-center"
              style={{
                backgroundColor: passed ? '#10B981' : '#EF4444',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Ionicons
                name={passed ? 'trophy' : 'close-circle'}
                size={64}
                color="#FFFFFF"
              />
              <Text className="text-2xl font-bold mt-4" style={{ color: '#FFFFFF' }}>
                {passed ? 'Xuất sắc!' : 'Cần cố gắng thêm'}
              </Text>
              <Text className="text-5xl font-bold mt-4" style={{ color: '#FFFFFF' }}>
                {percentage}%
              </Text>
              <Text className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {score}/{questions.length} câu đúng
              </Text>
            </View>
          </View>

          {/* Answer Review */}
          <View className="px-6 pb-6">
            <Text className="text-lg font-bold mb-4" style={{ color: '#0F172A' }}>
              Chi tiết đáp án
            </Text>

            {questions.map((question, qIndex) => {
              const userAnswer = selectedAnswers[qIndex];
              const correctAnswer = question['đáp án đúng'];
              const isCorrect = userAnswer === correctAnswer;

              return (
                <View
                  key={qIndex}
                  className="mb-4 rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2,
                    borderColor: isCorrect ? '#10B981' : '#EF4444',
                  }}
                >
                  {/* Question Header */}
                  <View
                    className="p-4 flex-row items-center"
                    style={{
                      backgroundColor: isCorrect ? '#10B981' : '#EF4444',
                    }}
                  >
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                      <Text className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
                        {qIndex + 1}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold flex-1" style={{ color: '#FFFFFF' }}>
                      {question['câu hỏi']}
                    </Text>
                    <Ionicons
                      name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>

                  {/* Answers */}
                  <View className="p-4">
                    {question['các câu trả lời'].map((answer, aIndex) => {
                      const isUserAnswer = userAnswer === aIndex;
                      const isCorrectAnswer = correctAnswer === aIndex;

                      return (
                        <View
                          key={aIndex}
                          className="mb-2 p-3 rounded-xl flex-row items-center"
                          style={{
                            backgroundColor: isCorrectAnswer
                              ? '#D1FAE5'
                              : isUserAnswer
                              ? '#FEE2E2'
                              : '#F1F5F9',
                            borderWidth: 1,
                            borderColor: isCorrectAnswer
                              ? '#10B981'
                              : isUserAnswer
                              ? '#EF4444'
                              : '#E2E8F0',
                          }}
                        >
                          <View
                            className="w-6 h-6 rounded-full items-center justify-center mr-3"
                            style={{
                              backgroundColor: isCorrectAnswer
                                ? '#10B981'
                                : isUserAnswer
                                ? '#EF4444'
                                : '#94A3B8',
                            }}
                          >
                            {isCorrectAnswer ? (
                              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                            ) : isUserAnswer ? (
                              <Ionicons name="close" size={16} color="#FFFFFF" />
                            ) : (
                              <Text className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
                                {String.fromCharCode(65 + aIndex)}
                              </Text>
                            )}
                          </View>
                          <Text
                            className="text-sm flex-1"
                            style={{
                              color: isCorrectAnswer || isUserAnswer ? '#0F172A' : '#64748B',
                              fontWeight: isCorrectAnswer || isUserAnswer ? '600' : '400',
                            }}
                          >
                            {answer}
                          </Text>
                        </View>
                      );
                    })}

                    {/* Explanation */}
                    <View className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#FEF3C7' }}>
                      <View className="flex-row items-start mb-2">
                        <Ionicons name="bulb" size={16} color="#92400E" style={{ marginTop: 2 }} />
                        <Text className="text-xs font-bold ml-2" style={{ color: '#92400E' }}>
                          GIẢI THÍCH
                        </Text>
                      </View>
                      <Text className="text-sm leading-5" style={{ color: '#78350F' }}>
                        {question['giải thích']}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View className="px-6 pb-8 gap-3">
            <TouchableOpacity
              className="rounded-xl py-4 items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={handleRetry}
            >
              <Text className="text-base font-bold" style={{ color: '#FFFFFF' }}>
                Làm lại
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-xl py-4 items-center"
              style={{ backgroundColor: '#F1F5F9' }}
              onPress={() => navigation.goBack()}
            >
              <Text className="text-base font-bold" style={{ color: '#64748B' }}>
                Quay lại
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Quiz Questions View
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = selectedAnswers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Safety check: if no current question, show error
  if (!currentQuestion || !currentQuestion['các câu trả lời']) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
        <AppHeader title="Quiz" />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-lg font-bold text-center mt-4 mb-2" style={{ color: '#0F172A' }}>
            Dữ liệu quiz không hợp lệ
          </Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
            onPress={() => navigation.goBack()}
          >
            <Text className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
      <AppHeader title={`Câu ${currentQuestionIndex + 1}/${questions.length}`} />

      {/* Progress Bar */}
      <View className="px-6 pt-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs font-semibold" style={{ color: '#64748B' }}>
            Tiến độ
          </Text>
          <Text className="text-xs font-bold" style={{ color: colors.primary }}>
            {Math.round(progress)}%
          </Text>
        </View>
        <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
          <View
            className="h-full rounded-full"
            style={{ backgroundColor: colors.primary, width: `${progress}%` }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Question Card */}
        <View
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: colors.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-start mb-4">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Text className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                {currentQuestionIndex + 1}
              </Text>
            </View>
            <Text className="text-base font-bold flex-1 leading-6" style={{ color: '#FFFFFF' }}>
              {currentQuestion['câu hỏi']}
            </Text>
          </View>
        </View>

        {/* Answer Options */}
        <View className="mb-6">
          {currentQuestion['các câu trả lời'].map((answer, index) => {
            const isSelected = userAnswer === index;

            return (
              <TouchableOpacity
                key={index}
                className="mb-3 p-4 rounded-2xl flex-row items-center"
                style={{
                  backgroundColor: isSelected ? colors.primary + '15' : '#FFFFFF',
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : '#E2E8F0',
                }}
                onPress={() => handleSelectAnswer(index)}
                activeOpacity={0.7}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor: isSelected ? colors.primary : '#F1F5F9',
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : '#CBD5E1',
                  }}
                >
                  {isSelected ? (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  ) : (
                    <Text className="text-sm font-bold" style={{ color: '#94A3B8' }}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  )}
                </View>
                <Text
                  className="text-sm flex-1 leading-5"
                  style={{
                    color: isSelected ? colors.primary : '#0F172A',
                    fontWeight: isSelected ? '600' : '400',
                  }}
                >
                  {answer}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity
            className="flex-1 rounded-xl py-4 items-center"
            style={{ backgroundColor: currentQuestionIndex === 0 ? '#F1F5F9' : '#FFFFFF' }}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: currentQuestionIndex === 0 ? '#CBD5E1' : '#64748B' }}
            >
              ← Câu trước
            </Text>
          </TouchableOpacity>

          {currentQuestionIndex === questions.length - 1 ? (
            <TouchableOpacity
              className="flex-1 rounded-xl py-4 items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={handleSubmit}
            >
              <Text className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
                Nộp bài ✓
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="flex-1 rounded-xl py-4 items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNext}
            >
              <Text className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
                Câu sau →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
