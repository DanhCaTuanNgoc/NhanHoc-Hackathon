import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../stores/useThemeStore';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const themeOptions: { mode: ThemeMode; name: string; emoji: string; description: string }[] = [
  { mode: 'light', name: 'Sáng', emoji: '☀️', description: 'Giao diện sáng, dễ nhìn ban ngày' },
  { mode: 'dark', name: 'Tối', emoji: '🌙', description: 'Giao diện tối, bảo vệ mắt ban đêm' },
  { mode: 'ocean', name: 'Đại dương', emoji: '🌊', description: 'Xanh dương mát mẻ như biển' },
  { mode: 'sunset', name: 'Hoàng hôn', emoji: '🌅', description: 'Cam ấm áp như hoàng hôn' },
];

export default function ThemeSelector({ visible, onClose }: ThemeSelectorProps) {
  const { colors, mode, setTheme } = useTheme();

  const handleSelectTheme = (newMode: ThemeMode) => {
    setTheme(newMode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View 
          className="rounded-t-3xl p-6"
          style={{ 
            backgroundColor: colors.background.card,
            maxHeight: '70%'
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              🎨 Chọn giao diện
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-2xl" style={{ color: colors.text.muted }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Theme Options */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.mode}
                className="mb-4 p-4 rounded-2xl flex-row items-center"
                style={{
                  backgroundColor: mode === option.mode 
                    ? colors.primary 
                    : colors.background.secondary,
                  borderWidth: 2,
                  borderColor: mode === option.mode ? colors.accent : 'transparent',
                }}
                onPress={() => handleSelectTheme(option.mode)}
              >
                <Text className="text-4xl mr-4">{option.emoji}</Text>
                <View className="flex-1">
                  <Text 
                    className="text-lg font-bold mb-1" 
                    style={{ 
                      color: mode === option.mode ? '#FFFFFF' : colors.text.primary 
                    }}
                  >
                    {option.name}
                  </Text>
                  <Text 
                    className="text-sm" 
                    style={{ 
                      color: mode === option.mode ? '#e0e0e0' : colors.text.muted 
                    }}
                  >
                    {option.description}
                  </Text>
                </View>
                {mode === option.mode && (
                  <Text className="text-2xl">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
