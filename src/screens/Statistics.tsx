import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { colors } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

export default function Statistics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const studyData = {
    week: [
      { day: 'T2', hours: 2.5, exercises: 5 },
      { day: 'T3', hours: 3.2, exercises: 7 },
      { day: 'T4', hours: 1.8, exercises: 3 },
      { day: 'T5', hours: 4.1, exercises: 9 },
      { day: 'T6', hours: 2.9, exercises: 6 },
      { day: 'T7', hours: 5.5, exercises: 12 },
      { day: 'CN', hours: 4.2, exercises: 8 },
    ],
  };

  const maxHours = Math.max(...studyData.week.map(d => d.hours));
  const totalHours = studyData.week.reduce((sum, d) => sum + d.hours, 0);
  const totalExercises = studyData.week.reduce((sum, d) => sum + d.exercises, 0);
  const avgScore = 87;

  const subjects = [
    { name: 'Python', progress: 85, color: colors.primary, icon: 'logo-python' },
    { name: 'JavaScript', progress: 72, color: colors.warning, icon: 'logo-javascript' },
    { name: 'React', progress: 90, color: colors.accent, icon: 'logo-react' },
    { name: 'Machine Learning', progress: 65, color: colors.secondary, icon: 'hardware-chip' },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <AppHeader title="Thống kê" />
      
      <ScrollView className="flex-1">
        {/* Period Selector */}
        <View className="px-6 pt-6 pb-4">
          <View
            className="flex-row p-1 rounded-xl"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                className="flex-1 py-2.5 rounded-lg items-center"
                style={{
                  backgroundColor: selectedPeriod === period ? '#FFFFFF' : 'transparent',
                  shadowColor: selectedPeriod === period ? '#000' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: selectedPeriod === period ? 2 : 0,
                }}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: selectedPeriod === period ? colors.primary : '#64748b' }}
                >
                  {period === 'week' ? 'Tuần' : period === 'month' ? 'Tháng' : 'Năm'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3 mb-3">
            <View
              className="flex-1 p-4 rounded-2xl"
              style={{
                backgroundColor: colors.primary + '10',
                borderWidth: 1,
                borderColor: colors.primary + '30',
              }}
            >
              <Ionicons name="time" size={24} color={colors.primary} />
              <Text className="text-2xl font-bold mt-2" style={{ color: colors.primary }}>
                {totalHours.toFixed(1)}h
              </Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>
                Thời gian học
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
                {totalExercises}
              </Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>
                Bài tập
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
              <Ionicons name="trophy" size={24} color={colors.success} />
              <Text className="text-2xl font-bold mt-2" style={{ color: colors.success }}>
                {avgScore}%
              </Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>
                Điểm TB
              </Text>
            </View>
          </View>
        </View>

        {/* Study Time Chart */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="bar-chart" size={22} color="#3B82F6" />
            <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
              Thời gian học
            </Text>
          </View>
          
          <View
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#e2e8f0',
            }}
          >
            <View className="flex-row items-end justify-between" style={{ height: 180 }}>
              {studyData.week.map((data, index) => {
                const barHeight = (data.hours / maxHours) * 140;
                return (
                  <View key={index} className="items-center flex-1">
                    <View
                      className="w-full items-center justify-end"
                      style={{ height: 150 }}
                    >
                      <View
                        className="rounded-t-lg w-9"
                        style={{
                          height: barHeight,
                          backgroundColor: data.hours > 3 ? colors.primary : colors.secondary,
                        }}
                      />
                    </View>
                    <Text className="text-xs mt-2" style={{ color: '#64748b' }}>
                      {data.day}
                    </Text>
                    <Text className="text-xs font-bold" style={{ color: '#0f172a' }}>
                      {data.hours}h
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Subject Progress */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="book" size={22} color="#8B5CF6" />
            <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
              Tiến độ theo môn
            </Text>
          </View>

          {subjects.map((subject, index) => (
            <View
              key={index}
              className="mb-3 p-4 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#e2e8f0',
              }}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: subject.color + '20' }}
                >
                  <Ionicons name={subject.icon as any} size={20} color={subject.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold" style={{ color: '#0f172a' }}>
                    {subject.name}
                  </Text>
                  <Text className="text-xs" style={{ color: '#64748b' }}>
                    {subject.progress}% hoàn thành
                  </Text>
                </View>
                <Text className="text-lg font-bold" style={{ color: subject.color }}>
                  {subject.progress}%
                </Text>
              </View>

              <View
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: '#F1F5F9' }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: subject.color,
                    width: `${subject.progress}%`,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Learning Streak */}
        <View className="px-6 pb-8">
          <View className="flex-row items-center mb-4">
            <Ionicons name="flame" size={22} color="#EF4444" />
            <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
              Chuỗi học tập
            </Text>
          </View>

          <View
            className="p-6 rounded-2xl items-center"
            style={{
              backgroundColor: '#FEF2F2',
              borderWidth: 1,
              borderColor: '#FEE2E2',
            }}
          >
            <Ionicons name="flame" size={80} color="#EF4444" />
            <Text className="text-4xl font-bold mb-2" style={{ color: '#DC2626' }}>
              15 ngày
            </Text>
            <Text className="text-sm text-center" style={{ color: '#64748b' }}>
              Bạn đã học liên tục 15 ngày! Hãy tiếp tục phát huy!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
