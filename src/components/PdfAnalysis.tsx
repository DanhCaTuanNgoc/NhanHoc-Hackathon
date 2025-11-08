import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../config/api';
import { colors } from '../constants/theme';

interface PdfAnalysisResult {
  pdf_content: string; // base64
  message?: string;
}

interface PdfJobResponse {
  job_id: string;
  status: 'pending' | 'completed' | 'failed';
  result?: PdfAnalysisResult;
  error?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

export default function PdfAnalysis() {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [resultPdfBase64, setResultPdfBase64] = useState<string | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setError(null);
        setIsCompleted(false);
        setResultPdfBase64(null);
        console.log('📄 File selected:', result.assets[0].name);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      setError('Không thể chọn file');
    }
  };

  const analyzePdf = async () => {
    if (!selectedFile) {
      Alert.alert('Thông báo', 'Vui lòng chọn file PDF trước');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setProgressMessage('Đang chuẩn bị...');

    // Simulate progress
    const progressMessages = [
      { start: 0, end: 10, message: 'Đang đọc file PDF...', duration: 1000 },
      { start: 10, end: 20, message: 'Đang trích xuất nội dung...', duration: 1000 },
      { start: 20, end: 30, message: 'Đang gửi dữ liệu đến AI...', duration: 1000 },
      { start: 30, end: 50, message: 'AI đang phân tích nội dung...', duration: 2000 },
      { start: 50, end: 70, message: 'Đang tạo flashcard...', duration: 2000 },
      { start: 70, end: 90, message: 'Đang render PDF...', duration: 2000 },
      { start: 90, end: 99, message: 'Đang hoàn thiện...', duration: 1000 },
    ];

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      const currentMessage = progressMessages.find(
        pm => currentProgress >= pm.start && currentProgress < pm.end
      );
      
      if (currentMessage) {
        setProgressMessage(currentMessage.message);
        currentProgress += 1;
        setProgress(currentProgress);
      }

      if (currentProgress >= 99) {
        clearInterval(progressInterval);
      }
    }, 100);

    try {
      // Upload file
      const formData = new FormData();
      
      // Read file info
      const fileUri = selectedFile.uri;

      // Create file object for upload
      const file = {
        uri: fileUri,
        type: 'application/pdf',
        name: selectedFile.name,
      } as any;

      formData.append('file', file);

      console.log('📤 Uploading PDF to server...');

      const response = await fetch(`${API_BASE_URL}/api/analyze-pdf`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Có lỗi xảy ra khi phân tích PDF');
      }

      const { job_id, status, message } = await response.json();
      console.log(`✅ PDF Job created - ID: ${job_id}, Status: ${status}`);
      console.log(`📝 ${message}`);

      // Poll for result
      await pollPdfStatus(job_id, progressInterval);

    } catch (err: any) {
      console.error('❌ Error analyzing PDF:', err);
      clearInterval(progressInterval);
      setError(err.message || 'Có lỗi xảy ra khi phân tích PDF');
      setIsAnalyzing(false);
    }
  };

  const pollPdfStatus = async (
    jobId: string,
    progressInterval: NodeJS.Timeout,
    maxAttempts: number = 120,
    interval: number = 1000
  ) => {
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      try {
        attempts++;
        console.log(`[Polling] Attempt ${attempts}/${maxAttempts} - Job ID: ${jobId}`);

        const response = await fetch(`${API_BASE_URL}/api/analyze-pdf/status/${jobId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể kiểm tra trạng thái');
        }

        const jobData: PdfJobResponse = await response.json();
        console.log(`[Polling] Status: ${jobData.status}`);

        if (jobData.status === 'completed' && jobData.result) {
          console.log('[Polling] ✅ Completed!');
          
          clearInterval(progressInterval);
          setProgress(100);
          setProgressMessage('Hoàn thành!');

          setResultPdfBase64(jobData.result.pdf_content);
          setIsCompleted(true);
          setIsAnalyzing(false);
          return;
        } else if (jobData.status === 'failed') {
          console.error('[Polling] ❌ Failed:', jobData.error);
          
          clearInterval(progressInterval);
          setError(jobData.error || 'Có lỗi xảy ra khi phân tích PDF');
          setIsAnalyzing(false);
          return;
        } else if (attempts >= maxAttempts) {
          console.error('[Polling] ⏱️ Timeout');
          
          clearInterval(progressInterval);
          setError('Quá trình phân tích mất quá nhiều thời gian. Vui lòng thử lại sau.');
          setIsAnalyzing(false);
          return;
        }

        // Continue polling
        setTimeout(checkStatus, interval);
      } catch (error: any) {
        // Ẩn error log polling để UI sạch hơn
        // console.error('[Polling] Error:', error);

        if (attempts >= maxAttempts) {
          clearInterval(progressInterval);
          setError('Không thể kết nối đến server. Vui lòng thử lại.');
          setIsAnalyzing(false);
          return;
        }

        setTimeout(checkStatus, interval);
      }
    };

    await checkStatus();
  };

  const downloadResult = async () => {
    if (!resultPdfBase64 || !selectedFile) return;

    try {
      if (Platform.OS === 'web') {
        // Web: Use Blob and download link
        const binaryString = atob(resultPdfBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analyzed_${selectedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert('Thành công', 'File PDF đã được tải về');
      } else {
        // Mobile: Use FileSystem to save file
        const fileName = `analyzed_${selectedFile.name}`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        // Write base64 to file
        await FileSystem.writeAsStringAsync(fileUri, resultPdfBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Lưu hoặc chia sẻ PDF',
            UTI: 'com.adobe.pdf',
          });
          Alert.alert('Thành công', 'File PDF đã được lưu và sẵn sàng chia sẻ');
        } else {
          Alert.alert(
            'Đã lưu file',
            `File đã được lưu tại: ${fileUri}`,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (err) {
      console.error('Error downloading result:', err);
      Alert.alert('Lỗi', 'Không thể tải về file PDF');
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setIsCompleted(false);
    setResultPdfBase64(null);
    setError(null);
    setProgress(0);
    setProgressMessage('');
  };

  return (
    <View className="px-6 pt-6 pb-8">
      <View className="flex-row items-center mb-4">
        <Ionicons name="document-text" size={22} color="#8B5CF6" />
        <Text className="text-lg font-bold ml-2" style={{ color: '#0f172a' }}>
          Phân tích tài liệu PDF
        </Text>
      </View>

      <Text className="text-sm mb-4" style={{ color: '#64748b' }}>
        Upload file PDF để AI phân tích và tạo flashcard học tập chi tiết
      </Text>

      {!isCompleted ? (
        <>
          {/* File Picker */}
          <TouchableOpacity
            onPress={pickDocument}
            disabled={isAnalyzing}
            className="p-4 rounded-2xl mb-3 border-2 border-dashed"
            style={{
              backgroundColor: selectedFile ? '#F0F9FF' : '#F8FAFC',
              borderColor: selectedFile ? colors.primary : '#E2E8F0',
            }}
          >
            <View className="items-center">
              <Ionicons
                name={selectedFile ? 'document-attach' : 'cloud-upload-outline'}
                size={48}
                color={selectedFile ? colors.primary : '#94A3B8'}
              />
              <Text className="text-base font-semibold mt-2" style={{ color: '#0f172a' }}>
                {selectedFile ? selectedFile.name : 'Chọn file PDF'}
              </Text>
              {selectedFile && (
                <Text className="text-xs mt-1" style={{ color: '#64748b' }}>
                  {(selectedFile.size! / 1024 / 1024).toFixed(2)} MB
                </Text>
              )}
              {!selectedFile && (
                <Text className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                  Nhấn để chọn file PDF từ thiết bị
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View
              className="p-3 rounded-xl mb-3 flex-row items-center"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="text-sm ml-2 flex-1" style={{ color: '#DC2626' }}>
                {error}
              </Text>
            </View>
          )}

          {/* Progress */}
          {isAnalyzing && (
            <View className="mb-3">
              <View className="flex-row items-center mb-2">
                <ActivityIndicator size="small" color={colors.primary} />
                <Text className="text-sm ml-2" style={{ color: '#475569' }}>
                  {progressMessage}
                </Text>
              </View>
              <View
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: '#E2E8F0' }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
              <Text className="text-xs mt-1 text-right" style={{ color: '#94A3B8' }}>
                {progress}%
              </Text>
            </View>
          )}

          {/* Analyze Button */}
          <TouchableOpacity
            onPress={analyzePdf}
            disabled={!selectedFile || isAnalyzing}
            className="py-4 rounded-xl items-center flex-row justify-center"
            style={{
              backgroundColor: !selectedFile || isAnalyzing ? '#CBD5E1' : colors.primary,
            }}
          >
            {isAnalyzing ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Đang phân tích...</Text>
              </>
            ) : (
              <>
                <Ionicons name="analytics" size={20} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Phân tích PDF</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Features Info */}
          <View className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: '#F8FAFC' }}>
            <Text className="text-sm font-semibold mb-2" style={{ color: '#475569' }}>
              Flashcard sẽ bao gồm:
            </Text>
            <View className="flex-row flex-wrap">
              {[
                'Tóm tắt tổng quan',
                'Mục tiêu học tập',
                'Thuật ngữ & định nghĩa',
                'Phương pháp nghiên cứu',
                'Bản đồ tư duy',
                'Câu hỏi tự đánh giá',
              ].map((feature, idx) => (
                <View key={idx} className="flex-row items-center mb-2 w-1/2">
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text className="text-xs ml-1 flex-1" style={{ color: '#64748b' }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Success State */}
          <View className="items-center py-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.success + '20' }}
            >
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            </View>
            
            <Text className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>
              Phân tích hoàn tất!
            </Text>
            
            <Text className="text-sm text-center mb-6" style={{ color: '#64748b' }}>
              Flashcard học tập đã được tạo thành công
            </Text>

            {/* Action Buttons */}
            <View className="w-full gap-3">
              <TouchableOpacity
                onPress={downloadResult}
                className="py-4 rounded-xl items-center flex-row justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Ionicons name="download" size={20} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Tải về PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetAnalysis}
                className="py-4 rounded-xl items-center flex-row justify-center"
                style={{
                  backgroundColor: '#F1F5F9',
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                }}
              >
                <Ionicons name="add-circle" size={20} color={colors.primary} />
                <Text className="font-bold ml-2" style={{ color: colors.primary }}>
                  Phân tích file mới
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
