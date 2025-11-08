import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/theme';

interface UploadButtonProps {
  onPress?: () => void;
}

export default function UploadButton({ onPress }: UploadButtonProps) {
  return (
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
      onPress={onPress}
    >
      <View className="flex-row items-center mb-3">
        <Ionicons name="document-text-outline" size={32} color="#FFFFFF" />
        <View className="flex-1 ml-3">
          <Text className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
            Upload PDF mới
          </Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <Text className="text-sm leading-5 flex-1" style={{ color: '#e0e0e0' }}>
          Tạo bài giảng và bài tập tự động với AI trong vài giây
        </Text>
        <Ionicons name="sparkles" size={18} color="#FBBF24" style={{ marginLeft: 4 }} />
      </View>
    </TouchableOpacity>
  );
}
