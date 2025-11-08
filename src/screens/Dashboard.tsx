import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { RootStackParamList } from '../types';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardProps {
  navigation: DashboardScreenNavigationProp;
}

export default function Dashboard({ navigation }: DashboardProps) {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-sm" style={{ color: '#64748b' }}>Xin chào,</Text>
              <Text className="text-2xl font-bold" style={{ color: '#0f172a' }}>Học viên 👋</Text>
            </View>
            
            {/* Profile Button */}
            <TouchableOpacity 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ 
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Feather name="user" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-3 mb-4">
            <View 
              className="flex-1 p-4 rounded-2xl"
              style={{ 
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Text className="text-3xl font-bold mb-1" style={{ color: colors.primary }}>12</Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>Bài học</Text>
            </View>
            <View 
              className="flex-1 p-4 rounded-2xl"
              style={{ 
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Text className="text-3xl font-bold mb-1" style={{ color: colors.accent }}>8</Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>Hoàn thành</Text>
            </View>
            <View 
              className="flex-1 p-4 rounded-2xl"
              style={{ 
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Text className="text-3xl font-bold mb-1" style={{ color: colors.success }}>85%</Text>
              <Text className="text-xs" style={{ color: '#64748b' }}>Điểm TB</Text>
            </View>
          </View>
        </View>

        {/* Upload Section */}
        <View className="px-6 mb-8">
          <TouchableOpacity 
            className="p-6 rounded-2xl"
            style={{ 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons name="document-text-outline" size={32} color="#FFFFFF" />
              <View className="flex-1 ml-3">
                <Text className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                  Upload PDF mới
                </Text>
              </View>
            </View>
            <Text className="text-sm leading-5" style={{ color: '#e0e0e0' }}>
              Tạo bài giảng và bài tập tự động với AI trong vài giây ✨
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold mb-4" style={{ color: '#0f172a' }}>
            ⚡ Thao tác nhanh
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity 
              className="flex-1 min-w-[45%] p-4 rounded-xl items-center"
              style={{ 
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Ionicons name="library-outline" size={32} color={colors.primary} />
              <Text className="text-sm font-semibold mt-2" style={{ color: '#0f172a' }}>
                Thư viện
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 min-w-[45%] p-4 rounded-xl items-center"
              style={{ 
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Feather name="edit" size={32} color={colors.secondary} />
              <Text className="text-sm font-semibold mt-2" style={{ color: '#0f172a' }}>
                Làm bài
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-1 min-w-[45%] p-4 rounded-xl items-center"
              style={{ 
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Ionicons name="bar-chart-outline" size={32} color={colors.accent} />
              <Text className="text-sm font-semibold mt-2" style={{ color: '#0f172a' }}>
                Thống kê
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-1 min-w-[45%] p-4 rounded-xl items-center"
              style={{ 
                backgroundColor: '#F8FAFC',
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}
            >
              <Feather name="settings" size={32} color="#64748b" />
              <Text className="text-sm font-semibold mt-2" style={{ color: '#0f172a' }}>
                Cài đặt
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Lessons */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold mb-4" style={{ color: '#0f172a' }}>
            📖 Bài học gần đây
          </Text>
          
          {/* Sample Lesson Cards */}
          <View className="space-y-3">
            <TouchableOpacity 
              className="p-4 rounded-xl flex-row items-center mb-3"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View 
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.primary }}
              >
                <MaterialCommunityIcons name="calculator" size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold mb-1" style={{ color: '#0f172a' }}>
                  Toán học lớp 10
                </Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>
                  Chương 3: Hàm số bậc nhất
                </Text>
              </View>
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: colors.success + '20' }}
              >
                <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                  Hoàn thành
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="p-4 rounded-xl flex-row items-center mb-3"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View 
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.secondary }}
              >
                <Ionicons name="flask-outline" size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold mb-1" style={{ color: '#0f172a' }}>
                  Hóa học cơ bản
                </Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>
                  Bài 5: Phản ứng hóa học
                </Text>
              </View>
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: colors.accent + '20' }}
              >
                <Text className="text-xs font-semibold" style={{ color: colors.accent }}>
                  Đang học
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="p-4 rounded-xl flex-row items-center"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View 
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.warning }}
              >
                <Ionicons name="earth-outline" size={24} color="#0f172a" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold mb-1" style={{ color: '#0f172a' }}>
                  Địa lý thế giới
                </Text>
                <Text className="text-xs" style={{ color: '#64748b' }}>
                  Chương 1: Các châu lục
                </Text>
              </View>
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: '#94a3b820' }}
              >
                <Text className="text-xs font-semibold" style={{ color: '#64748b' }}>
                  Chưa học
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
