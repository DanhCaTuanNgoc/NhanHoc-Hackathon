import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { colors } from '../constants/theme';

interface UploadOptions {
  audienceLevel: 'beginner' | 'intermediate' | 'advanced';
  includeQuiz: boolean;
  includeInteractive: boolean;
  focusAreas: string;
}

export default function UploadDocument() {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<UploadOptions>({
    audienceLevel: 'intermediate',
    includeQuiz: true,
    includeInteractive: true,
    focusAreas: '',
  });

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setShowOptions(true);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn file. Vui lòng thử lại.');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setShowOptions(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Lỗi', 'Vui lòng chọn file PDF để tải lên!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Implement actual upload to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      Alert.alert(
        'Thành công!',
        'File đã được tải lên. Đang tạo khóa học...',
        [{ text: 'OK', onPress: () => {
          handleRemoveFile();
          setUploadProgress(0);
        }}]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải file lên. Vui lòng thử lại.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <AppHeader title="Upload Tài liệu" />
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Page Description */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="book" size={28} color={colors.primary} />
            <Text className="text-2xl font-bold ml-2" style={{ color: '#0f172a' }}>
              Tạo khóa học từ PDF
            </Text>
          </View>
          <Text className="text-base leading-6" style={{ color: '#64748b' }}>
            Tải lên tài liệu PDF và AI sẽ tự động tạo khóa học hoàn chỉnh với bài giảng, bài tập và câu hỏi trắc nghiệm.
          </Text>
        </View>

        {/* Upload Area */}
        {!selectedFile ? (
          <TouchableOpacity
            className="rounded-2xl p-8 items-center justify-center mb-6"
            style={{
              backgroundColor: '#F8FAFC',
              borderWidth: 2,
              borderColor: colors.primary,
              borderStyle: 'dashed',
              minHeight: 250,
            }}
            onPress={handlePickDocument}
          >
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <Ionicons name="cloud-upload-outline" size={40} color={colors.primary} />
            </View>
            <Text className="text-lg font-bold mb-2" style={{ color: '#0f172a' }}>
              Chọn file PDF
            </Text>
            <Text className="text-sm text-center" style={{ color: '#64748b' }}>
              Nhấn để chọn file từ thiết bị của bạn
            </Text>
            <Text className="text-xs text-center mt-2" style={{ color: '#94a3b8' }}>
              Hỗ trợ file PDF tối đa 50MB
            </Text>
          </TouchableOpacity>
        ) : (
          /* Selected File Card */
          <View
            className="rounded-2xl p-6 mb-6"
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <MaterialCommunityIcons name="file-pdf-box" size={28} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold mb-1" style={{ color: '#0f172a' }} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text className="text-sm" style={{ color: '#64748b' }}>
                    {(selectedFile.size! / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: '#FEE2E2' }}
                onPress={handleRemoveFile}
              >
                <Ionicons name="close" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <View
              className="h-px mb-4"
              style={{ backgroundColor: '#e2e8f0' }}
            />

            {/* Upload Options */}
            {showOptions && (
              <View>
                <View className="flex-row items-center mb-4">
                  <Ionicons name="settings-outline" size={20} color="#6366F1" />
                  <Text className="text-base font-bold ml-2" style={{ color: '#0f172a' }}>
                    Tùy chọn tạo khóa học
                  </Text>
                </View>

                {/* Audience Level */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold mb-2" style={{ color: '#64748b' }}>
                    Trình độ học viên
                  </Text>
                  <View className="flex-row gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        className="flex-1 py-3 rounded-xl items-center"
                        style={{
                          backgroundColor: options.audienceLevel === level ? colors.primary : '#F8FAFC',
                          borderWidth: 1,
                          borderColor: options.audienceLevel === level ? colors.primary : '#e2e8f0',
                        }}
                        onPress={() => setOptions({ ...options, audienceLevel: level })}
                      >
                        <Text
                          className="text-sm font-semibold"
                          style={{ color: options.audienceLevel === level ? '#FFFFFF' : '#64748b' }}
                        >
                          {level === 'beginner' ? 'Cơ bản' : level === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Options Toggles */}
                <View className="space-y-3">
                  <TouchableOpacity
                    className="flex-row items-center justify-between py-3 px-4 rounded-xl"
                    style={{ backgroundColor: '#F8FAFC' }}
                    onPress={() => setOptions({ ...options, includeQuiz: !options.includeQuiz })}
                  >
                    <View className="flex-row items-center flex-1">
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={options.includeQuiz ? colors.success : '#cbd5e1'}
                      />
                      <Text className="text-sm font-medium ml-3" style={{ color: '#0f172a' }}>
                        Thêm câu hỏi trắc nghiệm
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-row items-center justify-between py-3 px-4 rounded-xl"
                    style={{ backgroundColor: '#F8FAFC' }}
                    onPress={() => setOptions({ ...options, includeInteractive: !options.includeInteractive })}
                  >
                    <View className="flex-row items-center flex-1">
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={options.includeInteractive ? colors.success : '#cbd5e1'}
                      />
                      <Text className="text-sm font-medium ml-3" style={{ color: '#0f172a' }}>
                        Thêm bài tập tương tác
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Upload Button */}
            <TouchableOpacity
              className="py-4 rounded-xl items-center mt-6"
              style={{
                backgroundColor: colors.primary,
                opacity: isUploading ? 0.7 : 1,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <View className="items-center">
                  <ActivityIndicator color="#FFFFFF" />
                  <Text className="text-sm font-semibold mt-2" style={{ color: '#FFFFFF' }}>
                    Đang tải lên... {uploadProgress}%
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Ionicons name="rocket-outline" size={20} color="#FFFFFF" />
                  <Text className="text-base font-bold ml-2" style={{ color: '#FFFFFF' }}>
                    Tạo khóa học với AI
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Progress Bar */}
            {isUploading && (
              <View className="mt-4">
                <View 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#E5E7EB' }}
                >
                  <View 
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: colors.accent,
                      width: `${uploadProgress}%`,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Features Info */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Ionicons name="sparkles" size={22} color="#A855F7" />
            <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
              Tính năng AI
            </Text>
          </View>
          
          <View className="space-y-3">
            {[
              { icon: 'book-outline', color: '#3B82F6', title: 'Tạo bài giảng', desc: 'Tự động tóm tắt và cấu trúc nội dung' },
              { icon: 'create-outline', color: '#10B981', title: 'Câu hỏi trắc nghiệm', desc: 'Sinh câu hỏi và đáp án thông minh' },
              { icon: 'game-controller-outline', color: '#F59E0B', title: 'Bài tập tương tác', desc: 'Drag & drop, flashcard, flowchart' },
              { icon: 'analytics-outline', color: '#8B5CF6', title: 'Theo dõi tiến độ', desc: 'Thống kê học tập chi tiết' },
            ].map((feature, index) => (
              <View
                key={index}
                className="flex-row items-center p-4 rounded-xl"
                style={{ backgroundColor: '#F8FAFC' }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: feature.color + '20' }}
                >
                  <Ionicons name={feature.icon as any} size={20} color={feature.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold mb-0.5" style={{ color: '#0f172a' }}>
                    {feature.title}
                  </Text>
                  <Text className="text-xs" style={{ color: '#64748b' }}>
                    {feature.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
