import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getPersonalizedRecommendations, RecommendationsData } from '../api/recommendationsApi';
import AppHeader from '../components/AppHeader';
import { colors } from '../constants/theme';
import { useInitializeStores } from '../hooks/useInitializeStores';
import { getLearningDataForAnalytics } from '../services/localStorage';

export default function Recommendations() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const { isInitialized } = useInitializeStores();
  const [isLoadingRef, setIsLoadingRef] = useState(false); // Prevent duplicate calls

  useEffect(() => {
    if (isInitialized && !isLoadingRef) {
      loadRecommendations();
    }
  }, [isInitialized]);

  const loadRecommendations = async () => {
    // Prevent duplicate calls
    if (isLoadingRef) {
      console.log('⚠️ Already loading recommendations, skipping...');
      return;
    }

    try {
      setIsLoadingRef(true);
      setLoading(true);
      setError(null);

      // Lấy dữ liệu học tập
      const learningData = await getLearningDataForAnalytics();

      console.log('📊 Learning Data:', {
        activities: learningData.learning_activities.length,
        quizzes: learningData.quiz_results.length,
        topics: learningData.current_topics.length
      });

      // Kiểm tra nếu không có dữ liệu
      if (
        learningData.learning_activities.length === 0 && 
        learningData.quiz_results.length === 0
      ) {
        console.warn('⚠️ Không có dữ liệu để tạo recommendations');
        setLoading(false);
        setIsLoadingRef(false);
        return;
      }

      // Gọi API để lấy recommendations
      const result = await getPersonalizedRecommendations(learningData);
      setRecommendations(result);
      console.log('✅ Recommendations loaded successfully');

    } catch (err: any) {
      // console.error('❌ Error loading recommendations:', err);
      console.log('⚠️ Error loading recommendations:', err.message);
      setError(err.message || 'Có lỗi xảy ra khi tải recommendations');
    } finally {
      setLoading(false);
      setIsLoadingRef(false);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return colors.primary;
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'flash';
      case 'medium':
        return 'flag';
      case 'low':
        return 'bookmark';
      default:
        return 'information-circle';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10B981';
      case 'intermediate':
        return '#F59E0B';
      case 'advanced':
        return '#EF4444';
      case 'expert':
        return '#8B5CF6';
      default:
        return colors.primary;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung bình';
      case 'advanced':
        return 'Nâng cao';
      case 'expert':
        return 'Chuyên gia';
      default:
        return difficulty;
    }
  };

  // Hiển thị loading
  if (!isInitialized || loading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
        <AppHeader title="Gợi ý học tập" />
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-base text-center" style={{ color: '#64748b' }}>
            AI đang phân tích dữ liệu của bạn...
          </Text>
          <Text className="mt-2 text-sm text-center" style={{ color: '#94a3b8' }}>
            Vui lòng đợi trong giây lát
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
        <AppHeader title="Gợi ý học tập" />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle" size={80} color="#EF4444" />
          <Text className="text-xl font-bold mt-4" style={{ color: '#0f172a' }}>
            Có lỗi xảy ra
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: '#64748b' }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadRecommendations}
            className="mt-6 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị empty state - chỉ khi KHÔNG có dữ liệu gì cả
  if (!recommendations || (
    (!recommendations.next_topics || recommendations.next_topics.length === 0) &&
    !recommendations.performance &&
    !recommendations.learning_path &&
    !recommendations.difficulty_adjustment
  )) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
        <AppHeader title="Gợi ý học tập" />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="school" size={80} color={colors.primary} />
          <Text className="text-xl font-bold mt-4" style={{ color: '#0f172a' }}>
            Chưa có dữ liệu
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: '#64748b' }}>
            Hãy bắt đầu học tập và làm quiz để AI có thể phân tích và đưa ra gợi ý phù hợp với bạn!
          </Text>
          <TouchableOpacity
            onPress={loadRecommendations}
            className="mt-6 px-6 py-3 rounded-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">Làm mới</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <AppHeader title="Gợi ý học tập" />
      
      <ScrollView className="flex-1">
        {/* Performance Summary */}
        {recommendations.recommendations?.performance_summary && (
          <View className="px-6 pt-6">
            <View
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: '#F0F9FF',
                borderWidth: 1,
                borderColor: '#BAE6FD',
              }}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="analytics" size={24} color={colors.primary} />
                <Text className="text-base font-bold ml-2" style={{ color: colors.primary }}>
                  Tình hình học tập
                </Text>
              </View>
              <Text className="text-sm" style={{ color: '#475569' }}>
                {recommendations.recommendations.performance_summary}
              </Text>
            </View>
          </View>
        )}

        {/* Performance Metrics */}
        {recommendations.performance && (
          <View className="px-6 pt-6">
            <View className="flex-row gap-3 mb-3">
              <View
                className="flex-1 p-4 rounded-2xl"
                style={{
                  backgroundColor: colors.primary + '10',
                  borderWidth: 1,
                  borderColor: colors.primary + '30',
                }}
              >
                <Ionicons name="trophy" size={24} color={colors.primary} />
                <Text className="text-2xl font-bold mt-2" style={{ color: colors.primary }}>
                  {recommendations.performance.avg_score.toFixed(0)}%
                </Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>
                  Điểm TB
                </Text>
              </View>

              <View
                className="flex-1 p-4 rounded-2xl"
                style={{
                  backgroundColor: colors.accent + '10',
                  borderWidth: 1,
                  borderColor: colors.accent + '30',
                }}
              >
                <Ionicons name="checkmark-done" size={24} color={colors.accent} />
                <Text className="text-2xl font-bold mt-2" style={{ color: colors.accent }}>
                  {recommendations.performance.total_quizzes}
                </Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>
                  Bài quiz
                </Text>
              </View>

              <View
                className="flex-1 p-4 rounded-2xl"
                style={{
                  backgroundColor: colors.success + '10',
                  borderWidth: 1,
                  borderColor: colors.success + '30',
                }}
              >
                <Ionicons name="book" size={24} color={colors.success} />
                <Text className="text-2xl font-bold mt-2" style={{ color: colors.success }}>
                  {recommendations.performance.topics_studied}
                </Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>
                  Chủ đề
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Next Topics to Study */}
        {recommendations.next_topics && recommendations.next_topics.length > 0 && (
          <View className="px-6 pt-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="trending-up" size={22} color="#3B82F6" />
              <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
                Chủ đề tiếp theo dành cho bạn
              </Text>
            </View>

            {recommendations.next_topics.map((topic, index) => (
              <View
                key={index}
                className="mb-3 p-4 rounded-2xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                }}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-2">
                    <Text className="text-base font-bold" style={{ color: '#0f172a' }}>
                      {topic.topic}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons 
                        name={getPriorityIcon(topic.priority) as any} 
                        size={14} 
                        color={getPriorityColor(topic.priority)} 
                      />
                      <Text 
                        className="text-xs ml-1 font-semibold"
                        style={{ color: getPriorityColor(topic.priority) }}
                      >
                        Ưu tiên {topic.priority === 'high' ? 'cao' : topic.priority === 'medium' ? 'TB' : 'thấp'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-sm font-bold ml-1" style={{ color: '#F59E0B' }}>
                      {topic.relevance_score}/10
                    </Text>
                  </View>
                </View>

                <Text className="text-sm mb-3" style={{ color: '#64748b' }}>
                  {topic.reason}
                </Text>

                {topic.estimated_time && (
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="time-outline" size={16} color="#64748b" />
                    <Text className="text-xs ml-2" style={{ color: '#64748b' }}>
                      Thời gian: {topic.estimated_time}
                    </Text>
                  </View>
                )}

                {topic.prerequisites && topic.prerequisites.length > 0 && (
                  <View className="mb-2">
                    <Text className="text-xs font-semibold mb-1" style={{ color: '#475569' }}>
                      📚 Kiến thức cần có:
                    </Text>
                    {topic.prerequisites.map((prereq, idx) => (
                      <Text key={idx} className="text-xs ml-4" style={{ color: '#64748b' }}>
                        • {prereq}
                      </Text>
                    ))}
                  </View>
                )}

                {topic.benefits && topic.benefits.length > 0 && (
                  <View>
                    <Text className="text-xs font-semibold mb-1" style={{ color: '#475569' }}>
                      ✨ Lợi ích:
                    </Text>
                    {topic.benefits.map((benefit, idx) => (
                      <Text key={idx} className="text-xs ml-4" style={{ color: '#64748b' }}>
                        • {benefit}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Learning Path */}
        {recommendations.learning_path && recommendations.learning_path.milestones && (
          <View className="px-6 pt-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="map" size={22} color="#8B5CF6" />
              <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
                Lộ trình học tập
              </Text>
            </View>

            <Text className="text-sm mb-4" style={{ color: '#64748b' }}>
              {recommendations.learning_path.description}
            </Text>

            {recommendations.learning_path.milestones.map((milestone, index) => (
              <View
                key={index}
                className="mb-3 p-4 rounded-2xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                }}
              >
                <View className="flex-row items-start">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white font-bold">{index + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold mb-1" style={{ color: '#0f172a' }}>
                      {milestone.title}
                    </Text>
                    
                    {milestone.duration && (
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        <Text className="text-xs ml-1" style={{ color: '#64748b' }}>
                          {milestone.duration}
                        </Text>
                      </View>
                    )}

                    <Text className="text-sm mb-2" style={{ color: '#64748b' }}>
                      {milestone.description}
                    </Text>

                    {milestone.topics && milestone.topics.length > 0 && (
                      <View className="flex-row flex-wrap gap-2 mb-2">
                        {milestone.topics.map((topic, idx) => (
                          <View
                            key={idx}
                            className="px-2 py-1 rounded-lg"
                            style={{ backgroundColor: colors.primary + '15' }}
                          >
                            <Text className="text-xs" style={{ color: colors.primary }}>
                              {topic}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {milestone.goals && milestone.goals.length > 0 && (
                      <View>
                        <Text className="text-xs font-semibold mb-1" style={{ color: '#475569' }}>
                          🎯 Mục tiêu:
                        </Text>
                        {milestone.goals.map((goal, idx) => (
                          <Text key={idx} className="text-xs ml-4" style={{ color: '#64748b' }}>
                            • {goal}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}

            {recommendations.learning_path.total_duration && (
              <View
                className="p-4 rounded-2xl flex-row items-center"
                style={{
                  backgroundColor: '#FEF3C7',
                  borderWidth: 1,
                  borderColor: '#FDE68A',
                }}
              >
                <Ionicons name="trophy" size={24} color="#F59E0B" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs font-semibold" style={{ color: '#78350F' }}>
                    Thời gian hoàn thành dự kiến
                  </Text>
                  <Text className="text-base font-bold" style={{ color: '#92400E' }}>
                    {recommendations.learning_path.total_duration}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Difficulty Adjustment */}
        {recommendations.difficulty_adjustment && (
          <View className="px-6 pt-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="bar-chart" size={22} color="#EF4444" />
              <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
                Điều chỉnh độ khó
              </Text>
            </View>

            <View
              className="p-4 rounded-2xl mb-3"
              style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#e2e8f0',
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-xs mb-1" style={{ color: '#64748b' }}>
                    Trình độ hiện tại
                  </Text>
                  <View
                    className="px-3 py-2 rounded-lg"
                    style={{ 
                      backgroundColor: getDifficultyColor(recommendations.difficulty_adjustment.current_level) + '20'
                    }}
                  >
                    <Text 
                      className="text-sm font-bold"
                      style={{ color: getDifficultyColor(recommendations.difficulty_adjustment.current_level) }}
                    >
                      {getDifficultyText(recommendations.difficulty_adjustment.current_level)}
                    </Text>
                  </View>
                </View>

                <Ionicons name="arrow-forward" size={24} color="#94a3b8" />

                <View className="flex-1">
                  <Text className="text-xs mb-1" style={{ color: '#64748b' }}>
                    Độ khó đề xuất
                  </Text>
                  <View
                    className="px-3 py-2 rounded-lg"
                    style={{ 
                      backgroundColor: getDifficultyColor(recommendations.difficulty_adjustment.recommended_difficulty) + '20'
                    }}
                  >
                    <Text 
                      className="text-sm font-bold"
                      style={{ color: getDifficultyColor(recommendations.difficulty_adjustment.recommended_difficulty) }}
                    >
                      {getDifficultyText(recommendations.difficulty_adjustment.recommended_difficulty)}
                    </Text>
                  </View>
                </View>
              </View>

              {recommendations.difficulty_adjustment.reason && (
                <View className="flex-row items-start">
                  <Ionicons name="bulb" size={16} color="#F59E0B" style={{ marginTop: 2 }} />
                  <Text className="text-sm ml-2 flex-1" style={{ color: '#64748b' }}>
                    {recommendations.difficulty_adjustment.reason}
                  </Text>
                </View>
              )}
            </View>

            {recommendations.difficulty_adjustment.adjustment_tips && 
             recommendations.difficulty_adjustment.adjustment_tips.length > 0 && (
              <View
                className="p-4 rounded-2xl"
                style={{
                  backgroundColor: '#FEF3C7',
                  borderWidth: 1,
                  borderColor: '#FDE68A',
                }}
              >
                <Text className="text-sm font-semibold mb-2" style={{ color: '#78350F' }}>
                  💡 Gợi ý điều chỉnh:
                </Text>
                {recommendations.difficulty_adjustment.adjustment_tips.map((tip, idx) => (
                  <Text key={idx} className="text-xs mb-1 ml-2" style={{ color: '#92400E' }}>
                    • {tip}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* General Tips */}
        {recommendations.recommendations?.general_tips && 
         recommendations.recommendations.general_tips.length > 0 && (
          <View className="px-6 pt-6 pb-8">
            <View className="flex-row items-center mb-4">
              <Ionicons name="bulb" size={22} color="#F59E0B" />
              <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
                Lời khuyên chung
              </Text>
            </View>

            {recommendations.recommendations.general_tips.map((tip, index) => (
              <View
                key={index}
                className="mb-3 p-4 rounded-2xl flex-row items-start"
                style={{
                  backgroundColor: '#FFFBEB',
                  borderWidth: 1,
                  borderColor: '#FEF3C7',
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#F59E0B" style={{ marginTop: 2 }} />
                <Text className="text-sm ml-3 flex-1" style={{ color: '#78350F' }}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Refresh Button */}
        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={loadRecommendations}
            className="py-4 rounded-xl items-center flex-row justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">Làm mới gợi ý</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
