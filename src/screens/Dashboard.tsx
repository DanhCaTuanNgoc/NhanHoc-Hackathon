import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionCard from '../components/ActionCard';
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
          <UploadButton />
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center mb-4">
            <Ionicons name="flash" size={24} color="#FBBF24" />
            <Text className="text-xl font-bold ml-2" style={{ color: '#0f172a' }}>
              Thao tác nhanh
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-3">
            <ActionCard
              icon={<Ionicons name="library-outline" size={32} color={colors.primary} />}
              label="Thư viện"
            />
            <ActionCard
              icon={<Feather name="edit" size={32} color={colors.secondary} />}
              label="Làm bài"
            />
            <ActionCard
              icon={<Ionicons name="bar-chart-outline" size={32} color={colors.accent} />}
              label="Thống kê"
            />
            <ActionCard
              icon={<Feather name="settings" size={32} color="#64748b" />}
              label="Cài đặt"
            />
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
