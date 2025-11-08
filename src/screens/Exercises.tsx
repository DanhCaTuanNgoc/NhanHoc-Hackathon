import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { colors } from '../constants/theme';

interface Course {
  id: string;
  title: string;
  progress: number;
  totalExercises: number;
  completedExercises: number;
  icon: string;
  color: string;
}

export default function Exercises() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  const activeCourses: Course[] = [
    {
      id: '1',
      title: 'Lập trình Python Cơ bản',
      progress: 65,
      totalExercises: 20,
      completedExercises: 13,
      icon: 'logo-python',
      color: colors.primary,
    },
    {
      id: '2',
      title: 'Machine Learning Nâng cao',
      progress: 40,
      totalExercises: 15,
      completedExercises: 6,
      icon: 'hardware-chip',
      color: colors.secondary,
    },
    {
      id: '3',
      title: 'Web Development với React',
      progress: 80,
      totalExercises: 25,
      completedExercises: 20,
      icon: 'logo-react',
      color: colors.accent,
    },
  ];

  const completedCourses: Course[] = [
    {
      id: '4',
      title: 'JavaScript ES6+',
      progress: 100,
      totalExercises: 18,
      completedExercises: 18,
      icon: 'logo-javascript',
      color: colors.warning,
    },
  ];

  const courses = selectedTab === 'active' ? activeCourses : completedCourses;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <AppHeader title="Bài tập & Kiểm tra" />
      
      <ScrollView className="flex-1">
        {/* Stats Overview */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row gap-3">
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
                39
              </Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>
                Bài hoàn thành
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
              <Ionicons name="time" size={24} color={colors.accent} />
              <Text className="text-2xl font-bold mt-2" style={{ color: colors.accent }}>
                15
              </Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>
                Đang làm
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
              <Ionicons name="stats-chart" size={24} color={colors.success} />
              <Text className="text-2xl font-bold mt-2" style={{ color: colors.success }}>
                87%
              </Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>
                Điểm TB
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        <View className="px-6 mb-4">
          <View
            className="flex-row p-1 rounded-xl"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg items-center"
              style={{
                backgroundColor: selectedTab === 'active' ? '#FFFFFF' : 'transparent',
                shadowColor: selectedTab === 'active' ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: selectedTab === 'active' ? 2 : 0,
              }}
              onPress={() => setSelectedTab('active')}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: selectedTab === 'active' ? colors.primary : '#64748b' }}
              >
                Đang học ({activeCourses.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-3 rounded-lg items-center"
              style={{
                backgroundColor: selectedTab === 'completed' ? '#FFFFFF' : 'transparent',
                shadowColor: selectedTab === 'completed' ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: selectedTab === 'completed' ? 2 : 0,
              }}
              onPress={() => setSelectedTab('completed')}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: selectedTab === 'completed' ? colors.primary : '#64748b' }}
              >
                Hoàn thành ({completedCourses.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Course List */}
        <View className="px-6 pb-6">
          {courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              className="mb-4 p-5 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {/* Course Header */}
              <View className="flex-row items-center mb-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: course.color + '20' }}
                >
                  <Ionicons name={course.icon as any} size={24} color={course.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold mb-1" style={{ color: '#0f172a' }}>
                    {course.title}
                  </Text>
                  <Text className="text-sm" style={{ color: '#64748b' }}>
                    {course.completedExercises}/{course.totalExercises} bài tập
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>

              {/* Progress Bar */}
              <View className="mb-3">
                <View
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#F1F5F9' }}
                >
                  <View
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: course.color,
                      width: `${course.progress}%`,
                    }}
                  />
                </View>
                <Text className="text-xs mt-1 text-right" style={{ color: '#64748b' }}>
                  {course.progress}% hoàn thành
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 py-2.5 rounded-lg flex-row items-center justify-center"
                  style={{ backgroundColor: course.color }}
                >
                  <MaterialCommunityIcons name="play" size={18} color="#FFFFFF" />
                  <Text className="text-sm font-semibold ml-1.5" style={{ color: '#FFFFFF' }}>
                    Tiếp tục
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="px-4 py-2.5 rounded-lg"
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                  }}
                >
                  <Ionicons name="stats-chart-outline" size={18} color="#64748b" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {/* Empty State */}
          {courses.length === 0 && (
            <View className="items-center justify-center py-12">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: '#F8FAFC' }}
              >
                <Ionicons name="document-text-outline" size={40} color="#94a3b8" />
              </View>
              <Text className="text-base font-semibold mb-2" style={{ color: '#64748b' }}>
                Chưa có bài tập nào
              </Text>
              <Text className="text-sm text-center" style={{ color: '#94a3b8' }}>
                {selectedTab === 'active' 
                  ? 'Tải lên tài liệu để tạo khóa học mới'
                  : 'Bạn chưa hoàn thành khóa học nào'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
