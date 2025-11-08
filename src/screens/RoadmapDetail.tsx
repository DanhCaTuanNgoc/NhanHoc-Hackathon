/**
 * RoadmapDetail Screen
 * Hiển thị chi tiết lộ trình học tập với UI đẹp mắt
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { colors } from '../constants/theme';
import type { RoadmapResult, SubTopic } from '../types/api';

interface RoadmapDetailProps {
  route: {
    params: {
      roadmap: RoadmapResult;
      topic: string;
    };
  };
  navigation: any;
}

export default function RoadmapDetail({ route, navigation }: RoadmapDetailProps) {
  const { roadmap, topic } = route.params;
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set(['tuần 1']));
  const [completedSubTopics, setCompletedSubTopics] = useState<Set<string>>(new Set());

  // Convert roadmap object to array
  const weeks = Object.entries(roadmap).map(([weekKey, weekData]) => ({
    weekKey,
    weekNumber: parseInt(weekKey.replace('tuần ', '')),
    title: weekData['chủ đề'],
    subtopics: weekData['các chủ đề con'],
  }));

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(weekKey)) {
        newSet.delete(weekKey);
      } else {
        newSet.add(weekKey);
      }
      return newSet;
    });
  };

  const toggleSubTopic = (weekKey: string, subTopicTitle: string) => {
    const key = `${weekKey}-${subTopicTitle}`;
    setCompletedSubTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getWeekProgress = (weekKey: string, subTopics: SubTopic[]) => {
    const completed = subTopics.filter((st) =>
      completedSubTopics.has(`${weekKey}-${st['chủ đề con']}`)
    ).length;
    return Math.round((completed / subTopics.length) * 100);
  };

  const getTotalProgress = () => {
    const totalSubTopics = weeks.reduce(
      (sum, week) => sum + week.subtopics.length,
      0
    );
    return Math.round((completedSubTopics.size / totalSubTopics) * 100);
  };

  const handleStartQuiz = (subtopic: SubTopic, weekTitle: string) => {
    navigation.navigate('Quiz', {
      course: topic,
      topic: weekTitle,
      subtopic: subtopic['chủ đề con'],
      description: subtopic['mô tả'],
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
      <AppHeader title="Lộ Trình Học Tập" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View className="px-6 pt-6 pb-4">
          <View
            className="rounded-2xl p-6"
            style={{
              backgroundColor: colors.primary,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center mb-3">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Ionicons name="school" size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  CHỦ ĐỀ HỌC TẬP
                </Text>
                <Text className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                  {topic}
                </Text>
              </View>
            </View>

            {/* Overall Progress */}
            <View className="mt-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Tiến độ tổng quan
                </Text>
                <Text className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                  {getTotalProgress()}%
                </Text>
              </View>
              <View
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: '#FFFFFF',
                    width: `${getTotalProgress()}%`,
                  }}
                />
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' }}>
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                  {weeks.length}
                </Text>
                <Text className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Tuần học
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                  {weeks.reduce((sum, w) => sum + w.subtopics.length, 0)}
                </Text>
                <Text className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Chủ đề
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                  {completedSubTopics.size}
                </Text>
                <Text className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Hoàn thành
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Timeline */}
        <View className="px-6 pb-6">
          {weeks.map((week) => {
            const isExpanded = expandedWeeks.has(week.weekKey);
            const weekProgress = getWeekProgress(week.weekKey, week.subtopics);
            const isCompleted = weekProgress === 100;

            return (
              <View key={week.weekKey} className="mb-4">
                {/* Week Header */}
                <TouchableOpacity
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2,
                    borderColor: isCompleted ? '#10B981' : isExpanded ? colors.primary : '#E2E8F0',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  onPress={() => toggleWeek(week.weekKey)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    {/* Week Number Badge */}
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                      style={{
                        backgroundColor: isCompleted
                          ? '#10B981'
                          : isExpanded
                          ? colors.primary
                          : '#F1F5F9',
                      }}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
                      ) : (
                        <Text
                          className="text-xl font-bold"
                          style={{ color: isExpanded ? '#FFFFFF' : '#64748B' }}
                        >
                          {week.weekNumber}
                        </Text>
                      )}
                    </View>

                    {/* Week Info */}
                    <View className="flex-1 mr-3">
                      <Text className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>
                        TUẦN {week.weekNumber}
                      </Text>
                      <Text
                        className="text-base font-bold leading-5"
                        style={{ color: '#0F172A' }}
                        numberOfLines={2}
                      >
                        {week.title}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Ionicons name="list-outline" size={14} color="#64748B" />
                        <Text className="text-xs ml-1" style={{ color: '#64748B' }}>
                          {week.subtopics.length} chủ đề
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-gray-400 mx-2" />
                        <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                          {weekProgress}%
                        </Text>
                      </View>
                    </View>

                    {/* Expand Icon */}
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color={isExpanded ? colors.primary : '#94A3B8'}
                    />
                  </View>

                  {/* Week Progress Bar */}
                  <View className="mt-4">
                    <View
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: '#F1F5F9' }}
                    >
                      <View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: isCompleted ? '#10B981' : colors.primary,
                          width: `${weekProgress}%`,
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Sub Topics */}
                {isExpanded && (
                  <View className="mt-3 ml-4">
                    {week.subtopics.map((subTopic, subIndex) => {
                      const subTopicKey = `${week.weekKey}-${subTopic['chủ đề con']}`;
                      const isSubCompleted = completedSubTopics.has(subTopicKey);

                      return (
                        <View key={subIndex} className="mb-3">
                          {/* Timeline connector */}
                          {subIndex < week.subtopics.length - 1 && (
                            <View
                              className="absolute left-6 top-14 w-0.5"
                              style={{
                                height: 60,
                                backgroundColor: '#E2E8F0',
                              }}
                            />
                          )}

                          <View className="flex-row">
                            {/* Timeline dot */}
                            <View className="items-center mr-4">
                              <TouchableOpacity
                                className="w-12 h-12 rounded-full items-center justify-center"
                                style={{
                                  backgroundColor: isSubCompleted ? '#10B981' : '#F1F5F9',
                                  borderWidth: 2,
                                  borderColor: isSubCompleted ? '#10B981' : '#CBD5E1',
                                }}
                                onPress={() => toggleSubTopic(week.weekKey, subTopic['chủ đề con'])}
                              >
                                {isSubCompleted ? (
                                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                                ) : (
                                  <Text className="text-lg font-bold" style={{ color: '#94A3B8' }}>
                                    {subIndex + 1}
                                  </Text>
                                )}
                              </TouchableOpacity>
                            </View>

                            {/* Sub Topic Card */}
                            <TouchableOpacity
                              className="flex-1 rounded-xl p-4 mb-2"
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderWidth: 1,
                                borderColor: isSubCompleted ? '#10B981' : '#E2E8F0',
                                opacity: isSubCompleted ? 0.8 : 1,
                              }}
                              onPress={() => toggleSubTopic(week.weekKey, subTopic['chủ đề con'])}
                              activeOpacity={0.7}
                            >
                              <View className="flex-row items-start justify-between mb-2">
                                <Text
                                  className="text-sm font-bold flex-1 leading-5"
                                  style={{
                                    color: '#0F172A',
                                    textDecorationLine: isSubCompleted ? 'line-through' : 'none',
                                  }}
                                >
                                  {subTopic['chủ đề con']}
                                </Text>
                                <View
                                  className="px-2 py-1 rounded-md ml-2"
                                  style={{ backgroundColor: '#FEF3C7' }}
                                >
                                  <Text className="text-xs font-semibold" style={{ color: '#92400E' }}>
                                    ⏱️ {subTopic['thời gian']}
                                  </Text>
                                </View>
                              </View>
                              <Text className="text-xs leading-5 mb-3" style={{ color: '#64748B' }}>
                                {subTopic['mô tả']}
                              </Text>

                              {/* Quiz Button */}
                              <TouchableOpacity
                                className="flex-row items-center justify-center py-2 rounded-lg"
                                style={{
                                  backgroundColor: colors.primary + '15',
                                }}
                                onPress={() => handleStartQuiz(subTopic, week.title)}
                              >
                                <Ionicons name="school" size={16} color={colors.primary} />
                                <Text
                                  className="text-xs font-semibold ml-1"
                                  style={{ color: colors.primary }}
                                >
                                  Làm Quiz
                                </Text>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Completion CTA */}
        {getTotalProgress() === 100 && (
          <View className="px-6 pb-8">
            <View
              className="rounded-2xl p-6 items-center"
              style={{
                backgroundColor: '#10B981',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Ionicons name="trophy" size={48} color="#FFFFFF" />
              <Text className="text-xl font-bold mt-3" style={{ color: '#FFFFFF' }}>
                🎉 Chúc mừng!
              </Text>
              <Text className="text-sm text-center mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Bạn đã hoàn thành lộ trình học tập!
              </Text>
              <TouchableOpacity
                className="mt-4 px-6 py-3 rounded-xl"
                style={{ backgroundColor: '#FFFFFF' }}
                onPress={() => navigation.goBack()}
              >
                <Text className="text-sm font-bold" style={{ color: '#10B981' }}>
                  Tạo lộ trình mới
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
