import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import DashboardHeader from '../components/DashboardHeader';
import LessonCard from '../components/LessonCard';
import StatCard from '../components/StatCard';
import UploadButton from '../components/UploadButton';
import { colors } from '../constants/theme';
import { DrawerParamList } from '../types';

type DashboardScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Dashboard'>;

interface DashboardProps {
  navigation: DashboardScreenNavigationProp;
}

export default function Dashboard({ navigation }: DashboardProps) {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <AppHeader title="Trang chủ" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <DashboardHeader userName="Học viên" />

          {/* Stats Cards */}
          <View className="flex-row gap-3 mb-4">
            <StatCard value="12" label="Bài học" color={colors.primary} />
            <StatCard value="8" label="Hoàn thành" color={colors.accent} />
            <StatCard value="85%" label="Điểm TB" color={colors.success} />
          </View>
        </View>

        {/* Upload Section */}
        <View className="px-6 mb-8">
          <UploadButton navigation={navigation} />
        </View>

        {/* Course Summary */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons name="book-open-page-variant" size={24} color={colors.primary} />
            <Text className="text-xl font-bold ml-2" style={{ color: '#0f172a' }}>
              Tổng quan khóa học
            </Text>
          </View>
          
          <View className="rounded-2xl p-5" style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
                  <MaterialCommunityIcons name="school" size={24} color="#FFFFFF" />
                </View>
                <View className="ml-3">
                  <Text className="text-2xl font-bold" style={{ color: '#0f172a' }}>5</Text>
                  <Text className="text-sm" style={{ color: '#64748b' }}>Khóa học đang học</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-lg font-semibold" style={{ color: colors.accent }}>62%</Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>Hoàn thành</Text>
              </View>
            </View>
            
            <View className="h-px mb-4" style={{ backgroundColor: '#E2E8F0' }} />
            
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-xl font-bold" style={{ color: colors.secondary }}>32</Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>Bài giảng</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-xl font-bold" style={{ color: colors.accent }}>156</Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>Bài tập</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-xl font-bold" style={{ color: colors.success }}>24h</Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>Học tập</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Statistics */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center mb-4">
            <Ionicons name="bar-chart" size={24} color={colors.accent} />
            <Text className="text-xl font-bold ml-2" style={{ color: '#0f172a' }}>
              Thống kê tuần này
            </Text>
          </View>
          
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#FEF3C7' }}>
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="time-outline" size={20} color="#D97706" />
                <Text className="text-xs font-semibold" style={{ color: '#D97706' }}>+12%</Text>
              </View>
              <Text className="text-2xl font-bold mb-1" style={{ color: '#78350F' }}>8.5h</Text>
              <Text className="text-xs" style={{ color: '#92400E' }}>Thời gian học</Text>
            </View>
            
            <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#DBEAFE' }}>
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#2563EB" />
                <Text className="text-xs font-semibold" style={{ color: '#2563EB' }}>+8</Text>
              </View>
              <Text className="text-2xl font-bold mb-1" style={{ color: '#1E3A8A' }}>23</Text>
              <Text className="text-xs" style={{ color: '#1E40AF' }}>Bài hoàn thành</Text>
            </View>
          </View>
        </View>

        {/* Performance Overview */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.success} />
            <Text className="text-xl font-bold ml-2" style={{ color: '#0f172a' }}>
              Hiệu suất học tập
            </Text>
          </View>
          
          <View className="rounded-2xl p-5" style={{ backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' }}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold" style={{ color: '#15803D' }}>Điểm trung bình</Text>
              <View className="flex-row items-center">
                <Ionicons name="trending-up" size={16} color={colors.success} />
                <Text className="text-sm font-bold ml-1" style={{ color: colors.success }}>85%</Text>
              </View>
            </View>
            
            <View className="mb-3">
              <View className="h-2 rounded-full" style={{ backgroundColor: '#DCFCE7' }}>
                <View className="h-2 rounded-full" style={{ backgroundColor: colors.success, width: '85%' }} />
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs" style={{ color: '#16A34A' }}>Điểm cao nhất: 98%</Text>
              </View>
              <View>
                <Text className="text-xs" style={{ color: '#16A34A' }}>Điểm thấp nhất: 72%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Lessons */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="book" size={24} color="#8B5CF6" />
            <Text className="text-xl font-bold ml-2" style={{ color: '#0f172a' }}>
              Bài học gần đây
            </Text>
          </View>
          
          <View className="space-y-3">
            <LessonCard
              icon={<MaterialCommunityIcons name="calculator" size={24} color="#FFFFFF" />}
              title="Toán học lớp 10"
              subtitle="Chương 3: Hàm số bậc nhất"
              status="completed"
              statusColor={colors.success}
              statusLabel="Hoàn thành"
              backgroundColor={colors.primary}
            />
            <LessonCard
              icon={<Ionicons name="flask-outline" size={24} color="#FFFFFF" />}
              title="Hóa học cơ bản"
              subtitle="Bài 5: Phản ứng hóa học"
              status="in-progress"
              statusColor={colors.accent}
              statusLabel="Đang học"
              backgroundColor={colors.secondary}
            />
            <LessonCard
              icon={<Ionicons name="earth-outline" size={24} color="#0f172a" />}
              title="Địa lý thế giới"
              subtitle="Chương 1: Các châu lục"
              status="not-started"
              statusColor="#64748b"
              statusLabel="Chưa học"
              backgroundColor={colors.warning}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
