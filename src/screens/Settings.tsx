import React from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';

export default function Settings() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <AppHeader title="Cài đặt" />
      <ScrollView className="flex-1 px-6 pt-4">
        <Text style={{ color: '#64748b' }}>
          Tính năng đang được phát triển...
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
