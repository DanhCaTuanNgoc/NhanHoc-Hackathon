import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../components/ActionButton';
import CircularProgress from '../components/CircularProgress';
import UploadButton from '../components/UploadButton';
import { colors } from '../constants/theme';
import { DrawerParamList } from '../types';

type DashboardScreenNavigationProp = BottomTabNavigationProp<DrawerParamList, 'Dashboard'>;

interface DashboardProps {
  navigation: DashboardScreenNavigationProp;
}

export default function Dashboard({ navigation }: DashboardProps) {
  // Get current date info
  const now = new Date();
  const dayNumber = now.getDate();
  const dayName = now.toLocaleDateString('vi-VN', { weekday: 'long' });
  const monthYear = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  // Week status data (M-F)
  const weekStatus = [
    { day: 'M', completed: true, color: colors.primary },
    { day: 'T', completed: true, color: colors.accent },
    { day: 'W', completed: true, color: colors.primary },
    { day: 'Th', completed: false, color: '#E2E8F0' },
    { day: 'Fr', completed: false, color: '#E2E8F0' },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Blue Gradient Header with Border Radius */}
        <LinearGradient
          colors={[colors.primary, colors.secondary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 40,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          {/* Top Icons */}
          <View className="flex-row justify-between items-center mb-6">
            <Text 
              className="text-4xl font-bold" 
              style={{ 
                color: '#FFFFFF', 
                fontStyle: 'italic',
                letterSpacing: 2,
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
                fontWeight: '900',
              }}
            >
              Nhàn Học
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={() => navigation.navigate('UploadDocument')}>
                <Ionicons name="send" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="notifications" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Action Card */}
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
              </View>
              <Text className="text-sm font-semibold ml-3" style={{ color: '#1E293B' }}>
                Bài học hôm nay
              </Text>
            </View>
            <TouchableOpacity 
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.accent }}
              onPress={() => navigation.navigate('Exercises')}
            >
              <Text className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
                Bắt đầu
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Date Card */}
        <View className="mx-6 -mt-6 mb-6">
          <View 
            className="rounded-2xl p-5"
            style={{ 
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Text className="text-5xl font-bold mr-2" style={{ color: colors.primary }}>
                  {dayNumber}
                </Text>
                <View>
                  <Text className="text-xs font-semibold" style={{ color: '#64748B' }}>
                    {dayName}
                  </Text>
                  <Text className="text-xs" style={{ color: '#94A3B8' }}>
                    {monthYear}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
            </View>

            {/* This week status */}
            <Text className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>
              Trạng thái tuần này
            </Text>
            <View className="flex-row justify-between">
              {weekStatus.map((item, index) => (
                <View key={index} className="items-center">
                  <Text className="text-xs mb-2" style={{ color: '#64748B' }}>
                    {item.day}
                  </Text>
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.completed && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Circular Stats */}
        <View className="px-6 mb-6">
          <View 
            className="rounded-2xl p-5 flex-row justify-around"
            style={{ 
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <CircularProgress
              percentage={83}
              value="83%"
              label="Điểm danh"
              color={colors.primary}
              size={90}
            />
            <CircularProgress
              percentage={3}
              value="03"
              label="Nghỉ phép"
              color={colors.accent}
              size={90}
            />
            <CircularProgress
              percentage={23}
              value="23"
              label="Ngày học"
              color={colors.secondary}
              size={90}
            />
          </View>
        </View>

        {/* Action Buttons Grid */}
        <View className="px-6 mb-6">
          <View 
            className="rounded-2xl p-5"
            style={{ 
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Row 1 */}
            <View className="flex-row mb-6">
              <ActionButton
                icon={<Ionicons name="calendar" size={28} color={colors.primary} />}
                label="Xin nghỉ"
                backgroundColor="#E0F2FE"
                onPress={() => {}}
              />
              <ActionButton
                icon={<Ionicons name="trophy" size={28} color={colors.accent} />}
                label="Bảng xếp hạng"
                backgroundColor="#CFFAFE"
                onPress={() => navigation.navigate('Statistics')}
              />
              <ActionButton
                icon={<Ionicons name="newspaper" size={28} color={colors.secondary} />}
                label="Tin tức"
                badge={true}
                backgroundColor="#DBEAFE"
                onPress={() => {}}
              />
            </View>

            {/* Row 2 */}
            <View className="flex-row">
              <ActionButton
                icon={<Ionicons name="bar-chart" size={28} color={colors.primary} />}
                label="Dự đoán"
                backgroundColor="#E0F2FE"
                onPress={() => navigation.navigate('Statistics')}
              />
              <ActionButton
                icon={<Ionicons name="people" size={28} color={colors.accent} />}
                label="Bạn bè"
                backgroundColor="#CFFAFE"
                onPress={() => {}}
              />
              <ActionButton
                icon={<Ionicons name="create" size={28} color={colors.secondary} />}
                label="Bài tập"
                badge={true}
                backgroundColor="#DBEAFE"
                onPress={() => navigation.navigate('Exercises')}
              />
            </View>
          </View>
        </View>

        {/* Upload Section */}
        <View className="px-6 mb-6">
          <UploadButton navigation={navigation} />
        </View>

        {/* Course Summary - Keeping original functionality */}
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
      </ScrollView>
    </SafeAreaView>
  );
}
