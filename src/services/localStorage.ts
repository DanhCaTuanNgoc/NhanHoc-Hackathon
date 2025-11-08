/**
 * Local Storage Service
 * Quản lý lưu trữ dữ liệu khoá học, lộ trình học tập và quiz vào AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RoadmapResult } from '../types/api';

// Storage Keys
const STORAGE_KEYS = {
  COURSES: '@courses',
  QUIZ_RESULTS: '@quiz_results',
  CHAT_CONVERSATIONS: '@chat_conversations',
} as const;

// Types
export interface Course {
  id: string;
  title: string;
  topic: string;
  description: string;
  createdAt: string;
  roadmap: RoadmapResult;
  resource?: string; // Tài liệu học tập (Markdown content)
  totalSubTopics: number;
  completedSubTopics: string[]; // Array of completed subtopic IDs
  progress: number;
  icon: string;
  color: string;
  status: 'active' | 'completed';
  quizQuestionsPerLesson?: number; // Số câu hỏi mỗi bài quiz (mặc định 10)
  knowledgeLevel?: string; // Trình độ kiến thức
  studyTime?: string; // Thời gian học dự kiến
}

export interface QuizResult {
  id: string;
  courseId: string;
  courseTopic: string;
  weekTitle: string;
  subtopic: string;
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  reason: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Color palette for courses
const COURSE_COLORS = [
  '#5B9BD5', // Blue
  '#7B68EE', // Purple
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFB84D', // Orange
  '#95E1D3', // Mint
  '#F38181', // Pink
  '#AA96DA', // Lavender
];

const COURSE_ICONS = [
  'book-outline',
  'school-outline',
  'bulb-outline',
  'rocket-outline',
  'trophy-outline',
  'star-outline',
  'flame-outline',
  'heart-outline',
];

/**
 * Lấy tất cả khoá học
 */
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
};

/**
 * Lấy một khoá học theo ID
 */
export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const courses = await getAllCourses();
    return courses.find(course => course.id === id) || null;
  } catch (error) {
    console.error('Error getting course by id:', error);
    return null;
  }
};

/**
 * Tạo khoá học mới từ roadmap
 */
export const createCourse = async (
  topic: string,
  description: string,
  roadmap: RoadmapResult,
  quizQuestionsPerLesson: number = 10,
  resource?: string,
  knowledgeLevel?: string,
  studyTime?: string
): Promise<Course> => {
  try {
    const courses = await getAllCourses();
    
    // Tính tổng số subtopics
    const totalSubTopics = Object.values(roadmap).reduce(
      (sum, week) => sum + week['các chủ đề con'].length,
      0
    );

    // Tạo course mới
    const newCourse: Course = {
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: topic,
      topic,
      description,
      createdAt: new Date().toISOString(),
      roadmap,
      resource,
      totalSubTopics,
      completedSubTopics: [],
      progress: 0,
      icon: COURSE_ICONS[courses.length % COURSE_ICONS.length],
      color: COURSE_COLORS[courses.length % COURSE_COLORS.length],
      status: 'active',
      quizQuestionsPerLesson,
      knowledgeLevel,
      studyTime,
    };

    courses.push(newCourse);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    
    console.log('✅ Course created:', newCourse.id, `with ${quizQuestionsPerLesson} questions per quiz`);
    return newCourse;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Cập nhật tiến độ khoá học khi hoàn thành một subtopic
 */
export const markSubTopicCompleted = async (
  courseId: string,
  weekKey: string,
  subtopicTitle: string
): Promise<Course | null> => {
  try {
    const courses = await getAllCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      console.error('Course not found');
      return null;
    }

    const course = courses[courseIndex];
    const subtopicId = `${weekKey}-${subtopicTitle}`;
    
    // Thêm subtopic vào danh sách completed nếu chưa có
    if (!course.completedSubTopics.includes(subtopicId)) {
      course.completedSubTopics.push(subtopicId);
      
      // Cập nhật progress
      course.progress = Math.round(
        (course.completedSubTopics.length / course.totalSubTopics) * 100
      );

      // Cập nhật status nếu hoàn thành 100%
      if (course.progress === 100) {
        course.status = 'completed';
      }

      courses[courseIndex] = course;
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
      
      console.log('✅ SubTopic completed:', subtopicId, `(${course.progress}%)`);
    }

    return course;
  } catch (error) {
    console.error('Error marking subtopic completed:', error);
    return null;
  }
};

/**
 * Cập nhật tài liệu học tập cho khoá học
 */
export const updateCourseResource = async (
  courseId: string,
  resource: string
): Promise<Course | null> => {
  try {
    const courses = await getAllCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      console.error('Course not found');
      return null;
    }

    courses[courseIndex].resource = resource;
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    
    console.log('✅ Course resource updated:', courseId);
    return courses[courseIndex];
  } catch (error) {
    console.error('Error updating course resource:', error);
    return null;
  }
};

/**
 * Kiểm tra xem một subtopic đã hoàn thành chưa
 */
export const isSubTopicCompleted = async (
  courseId: string,
  weekKey: string,
  subtopicTitle: string
): Promise<boolean> => {
  try {
    const course = await getCourseById(courseId);
    if (!course) return false;
    
    const subtopicId = `${weekKey}-${subtopicTitle}`;
    return course.completedSubTopics.includes(subtopicId);
  } catch (error) {
    console.error('Error checking subtopic completion:', error);
    return false;
  }
};

/**
 * Lưu kết quả quiz
 */
export const saveQuizResult = async (
  courseId: string,
  courseTopic: string,
  weekTitle: string,
  subtopic: string,
  questions: QuizQuestion[],
  userAnswers: (number | null)[]
): Promise<QuizResult> => {
  try {
    console.log('💾 [saveQuizResult] Bắt đầu lưu...');
    console.log('📊 CourseId:', courseId);
    console.log('📚 Topic:', courseTopic);
    console.log('📖 Week:', weekTitle);
    console.log('📝 Subtopic:', subtopic);
    console.log('❓ Questions:', questions.length);
    console.log('✍️ User answers:', userAnswers);

    const quizResults = await getAllQuizResults();
    console.log('📋 Existing quiz results:', quizResults.length);
    
    // Tính điểm
    const correctAnswers = questions.filter(
      (q, index) => userAnswers[index] === q.answerIndex
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    console.log('💯 Calculated score:', score, '% (', correctAnswers, '/', questions.length, ')');

    const newResult: QuizResult = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseId,
      courseTopic,
      weekTitle,
      subtopic,
      questions,
      userAnswers,
      score,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
    };

    quizResults.push(newResult);
    
    console.log('💾 Saving to AsyncStorage...');
    await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(quizResults));
    
    console.log('✅ Quiz result saved successfully!');
    console.log('🆔 Result ID:', newResult.id);
    console.log('💯 Score:', score, '%');
    console.log('📊 Total quiz results now:', quizResults.length);
    
    return newResult;
  } catch (error) {
    console.error('❌ Error saving quiz result:', error);
    throw error;
  }
};

/**
 * Lấy tất cả kết quả quiz
 */
export const getAllQuizResults = async (): Promise<QuizResult[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
};

/**
 * Lấy kết quả quiz của một khoá học
 */
export const getCourseQuizResults = async (courseId: string): Promise<QuizResult[]> => {
  try {
    const allResults = await getAllQuizResults();
    return allResults.filter(result => result.courseId === courseId);
  } catch (error) {
    console.error('Error getting course quiz results:', error);
    return [];
  }
};

/**
 * Lấy kết quả quiz của một subtopic cụ thể
 */
export const getSubtopicQuizResults = async (
  courseId: string,
  subtopic: string
): Promise<QuizResult[]> => {
  try {
    const allResults = await getAllQuizResults();
    return allResults.filter(
      result => result.courseId === courseId && result.subtopic === subtopic
    );
  } catch (error) {
    console.error('Error getting subtopic quiz results:', error);
    return [];
  }
};

/**
 * Xoá một khoá học
 */
export const deleteCourse = async (courseId: string): Promise<boolean> => {
  try {
    const courses = await getAllCourses();
    const filteredCourses = courses.filter(c => c.id !== courseId);
    
    if (courses.length === filteredCourses.length) {
      console.error('Course not found');
      return false;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(filteredCourses));
    
    // Xoá cả quiz results của khoá học đó
    const quizResults = await getAllQuizResults();
    const filteredResults = quizResults.filter(r => r.courseId !== courseId);
    await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(filteredResults));
    
    console.log('✅ Course deleted:', courseId);
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
};

/**
 * Lấy thống kê tổng quan
 */
export const getStatistics = async () => {
  try {
    const courses = await getAllCourses();
    const quizResults = await getAllQuizResults();

    const activeCourses = courses.filter(c => c.status === 'active');
    const completedCourses = courses.filter(c => c.status === 'completed');
    
    const totalQuizzes = quizResults.length;
    const averageScore = quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
      : 0;

    const totalSubTopics = courses.reduce((sum, c) => sum + c.completedSubTopics.length, 0);

    return {
      totalCourses: courses.length,
      activeCourses: activeCourses.length,
      completedCourses: completedCourses.length,
      totalQuizzes,
      averageScore,
      totalSubTopics,
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      totalCourses: 0,
      activeCourses: 0,
      completedCourses: 0,
      totalQuizzes: 0,
      averageScore: 0,
      totalSubTopics: 0,
    };
  }
};

/**
 * Xoá toàn bộ dữ liệu (dùng cho testing/debugging)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.COURSES, STORAGE_KEYS.QUIZ_RESULTS, STORAGE_KEYS.CHAT_CONVERSATIONS]);
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// ============= Chat Conversation Functions =============

/**
 * Lấy tất cả chat conversations
 */
export const getAllChatConversations = async (): Promise<ChatConversation[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_CONVERSATIONS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting chat conversations:', error);
    return [];
  }
};

/**
 * Tạo conversation mới
 */
export const createChatConversation = async (title: string = 'Chat mới'): Promise<ChatConversation> => {
  try {
    const conversations = await getAllChatConversations();
    
    const newConversation: ChatConversation = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    conversations.unshift(newConversation); // Add to beginning
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(conversations));
    
    console.log('✅ Chat conversation created:', newConversation.id);
    return newConversation;
  } catch (error) {
    console.error('Error creating chat conversation:', error);
    throw error;
  }
};

/**
 * Lấy một conversation theo ID
 */
export const getChatConversationById = async (id: string): Promise<ChatConversation | null> => {
  try {
    const conversations = await getAllChatConversations();
    return conversations.find(conv => conv.id === id) || null;
  } catch (error) {
    console.error('Error getting chat conversation by id:', error);
    return null;
  }
};

/**
 * Thêm message vào conversation
 */
export const addMessageToConversation = async (
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatConversation | null> => {
  try {
    const conversations = await getAllChatConversations();
    const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);
    
    if (conversationIndex === -1) {
      console.error('Conversation not found:', conversationId);
      return null;
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    conversations[conversationIndex].messages.push(newMessage);
    conversations[conversationIndex].updatedAt = new Date().toISOString();

    // Auto-generate title from first user message
    if (conversations[conversationIndex].messages.length === 1 && role === 'user') {
      const titlePreview = content.length > 30 ? content.substring(0, 30) + '...' : content;
      conversations[conversationIndex].title = titlePreview;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(conversations));
    
    console.log('✅ Message added to conversation:', conversationId);
    return conversations[conversationIndex];
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    throw error;
  }
};

/**
 * Xoá một conversation
 */
export const deleteChatConversation = async (id: string): Promise<boolean> => {
  try {
    const conversations = await getAllChatConversations();
    const filteredConversations = conversations.filter(conv => conv.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_CONVERSATIONS, JSON.stringify(filteredConversations));
    
    console.log('✅ Chat conversation deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting chat conversation:', error);
    return false;
  }
};

/**
 * Lấy user context data để gửi cho AI
 * Tối ưu hóa: chỉ gửi summary thay vì toàn bộ chi tiết roadmap
 */
export const getUserContextData = async () => {
  try {
    const courses = await getAllCourses();
    const quizResults = await getAllQuizResults();

    // Build roadmaps summary (chỉ gửi tên khóa học và số tuần, không gửi chi tiết)
    const roadmaps: Record<string, any> = {};
    courses.forEach(course => {
      const weekKeys = Object.keys(course.roadmap || {}).filter(key => key.startsWith('tuần'));
      roadmaps[course.topic] = {
        totalWeeks: weekKeys.length,
        weeks: weekKeys,
        // Chỉ gửi title của mỗi tuần, không gửi chi tiết các chủ đề con
        weekTitles: weekKeys.reduce((acc, week) => {
          const weekData = course.roadmap[week];
          acc[week] = weekData?.['chủ đề'] || 'Unknown';
          return acc;
        }, {} as Record<string, string>),
      };
    });

    // Build quiz stats (giữ nguyên - đã tối ưu rồi)
    const quizStats: Record<string, any> = {};
    quizResults.forEach(result => {
      if (!quizStats[result.courseTopic]) {
        quizStats[result.courseTopic] = {};
      }
      if (!quizStats[result.courseTopic][result.weekTitle]) {
        quizStats[result.courseTopic][result.weekTitle] = {};
      }
      quizStats[result.courseTopic][result.weekTitle][result.subtopic] = {
        numQues: result.totalQuestions,
        numCorrect: Math.round((result.score / 100) * result.totalQuestions),
      };
    });

    // Count resources
    const resourceCount = courses.filter(c => c.resource).length;

    // Thêm thông tin về courses
    const courseSummary = courses.map(c => ({
      topic: c.topic,
      progress: c.progress,
      status: c.status,
      completedSubTopics: c.completedSubTopics.length,
      totalSubTopics: c.totalSubTopics,
    }));

    return {
      roadmaps, // Summary only - không có chi tiết các chủ đề con
      quizStats, // Kết quả quiz
      resourceCount, // Số tài nguyên
      courses: courseSummary, // Thông tin tóm tắt khóa học
    };
  } catch (error) {
    console.error('Error getting user context data:', error);
    return {
      roadmaps: {},
      quizStats: {},
      resourceCount: 0,
      courses: [],
    };
  }
};

/**
 * Tạo LearningData để gửi lên Analytics API
 */
export const getLearningDataForAnalytics = async () => {
  try {
    const courses = await getAllCourses();
    const quizResults = await getAllQuizResults();

    // Chuyển đổi quiz results sang format analytics
    const quiz_results = quizResults.map(result => ({
      topic: result.courseTopic,
      score: result.score,
      correct_answers: Math.round((result.score / 100) * result.totalQuestions),
      total_questions: result.totalQuestions,
      passed: result.score >= 70,
      date: result.completedAt,
    }));

    // Tạo learning activities từ quiz results
    const learning_activities = quizResults.map(result => ({
      date: result.completedAt,
      topic: result.courseTopic,
      duration: result.totalQuestions * 60, // Giả sử mỗi câu hỏi mất 1 phút
      type: 'quiz' as const,
    }));

    // Tính thời gian học cho mỗi topic (từ quiz)
    const time_spent: Record<string, number> = {};
    quizResults.forEach(result => {
      const topic = result.courseTopic;
      const duration = result.totalQuestions * 60; // seconds
      time_spent[topic] = (time_spent[topic] || 0) + duration;
    });

    // Danh sách các topic đang học
    const current_topics = courses.map(c => c.topic);

    return {
      learning_activities,
      quiz_results,
      time_spent,
      current_topics,
    };
  } catch (error) {
    console.error('Error getting learning data for analytics:', error);
    return {
      learning_activities: [],
      quiz_results: [],
      time_spent: {},
      current_topics: [],
    };
  }
};
