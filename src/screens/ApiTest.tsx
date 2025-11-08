/**
 * API Test Screen
 * Screen để test các API functions
 */

import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useQuiz } from '../hooks/useQuiz';
import { useResource } from '../hooks/useResource';
import { useRoadmap } from '../hooks/useRoadmap';

const ApiTestScreen = () => {
  const roadmap = useRoadmap();
  const quiz = useQuiz();
  const resource = useResource();

  const [activeTest, setActiveTest] = useState<string | null>(null);

  // Test Roadmap
  const handleTestRoadmap = async () => {
    setActiveTest('roadmap');
    
    const result = await roadmap.createAndWait({
      topic: 'React Native Development',
      time: '4 weeks',
      knowledge_level: 'Beginner',
    });

    if (result?.status === 'completed') {
      Alert.alert(
        '✅ Success',
        'Roadmap created successfully!',
        [{ text: 'OK', onPress: () => console.log('Result:', result.result) }]
      );
    } else if (result?.status === 'failed') {
      Alert.alert('❌ Failed', result.error || 'Unknown error');
    }

    setActiveTest(null);
  };

  // Test Quiz
  const handleTestQuiz = async () => {
    setActiveTest('quiz');
    
    const result = await quiz.createAndWait({
      course: 'React Native',
      topic: 'State Management',
      subtopic: 'useState Hook',
      description: 'Learn how to use useState for component state',
    });

    if (result?.status === 'completed') {
      const questions = result.result?.questions || [];
      Alert.alert(
        '✅ Success',
        `Quiz created with ${questions.length} questions!`,
        [{ text: 'OK', onPress: () => console.log('Questions:', questions) }]
      );
    } else if (result?.status === 'failed') {
      Alert.alert('❌ Failed', result.error || 'Unknown error');
    }

    setActiveTest(null);
  };

  // Test Resource
  const handleTestResource = async () => {
    setActiveTest('resource');
    
    const result = await resource.createAndWait({
      course: 'JavaScript',
      knowledge_level: 'Intermediate',
      description: 'Learn about Promises and async/await',
      time: '2 hours',
    });

    if (result?.status === 'completed') {
      Alert.alert(
        '✅ Success',
        `Resource created! (${result.result?.length || 0} characters)`,
        [{ text: 'OK', onPress: () => console.log('Content:', result.result) }]
      );
    } else if (result?.status === 'failed') {
      Alert.alert('❌ Failed', result.error || 'Unknown error');
    }

    setActiveTest(null);
  };

  const renderTestButton = (
    title: string,
    onPress: () => void,
    testKey: string,
    hookState: any
  ) => {
    const isActive = activeTest === testKey;
    const isLoading = hookState.loading;

    return (
      <TouchableOpacity
        style={[
          styles.testButton,
          isActive && styles.testButtonActive,
          isLoading && styles.testButtonLoading,
        ]}
        onPress={onPress}
        disabled={isLoading || activeTest !== null}
      >
        <View style={styles.testButtonContent}>
          <Text style={styles.testButtonTitle}>{title}</Text>
          {isLoading && (
            <ActivityIndicator size="small" color="#fff" style={styles.loader} />
          )}
        </View>

        {hookState.status && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Status: {hookState.status.status}
            </Text>
            {hookState.jobId && (
              <Text style={styles.jobIdText} numberOfLines={1}>
                Job: {hookState.jobId}
              </Text>
            )}
          </View>
        )}

        {hookState.error && (
          <Text style={styles.errorText}>{hookState.error}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>API Test Screen</Text>
        <Text style={styles.subtitle}>
          Test các API endpoints với Heroku backend
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗺️ Roadmap API</Text>
        {renderTestButton(
          'Test Create Roadmap',
          handleTestRoadmap,
          'roadmap',
          roadmap
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Quiz API</Text>
        {renderTestButton(
          'Test Create Quiz',
          handleTestQuiz,
          'quiz',
          quiz
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Resource API</Text>
        {renderTestButton(
          'Test Create Resource',
          handleTestResource,
          'resource',
          resource
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Information</Text>
        <Text style={styles.infoText}>
          • Tests sẽ tạo job và tự động poll cho đến khi hoàn thành
        </Text>
        <Text style={styles.infoText}>
          • Mỗi test có thể mất 10-30 giây
        </Text>
        <Text style={styles.infoText}>
          • Check console logs để xem chi tiết
        </Text>
        <Text style={styles.infoText}>
          • Backend: https://nhanhoc-ca30a6361738.herokuapp.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonActive: {
    backgroundColor: '#0056b3',
  },
  testButtonLoading: {
    opacity: 0.8,
  },
  testButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loader: {
    marginLeft: 12,
  },
  statusContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  statusText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  jobIdText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 14,
    color: '#ffcccb',
    marginTop: 8,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default ApiTestScreen;
