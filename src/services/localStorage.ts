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
} as const;

// Types
export interface Course {
  id: string;
  title: string;
  topic: string;
  description: string;
  createdAt: string;
  roadmap: RoadmapResult;
  totalSubTopics: number;
  completedSubTopics: string[]; // Array of completed subtopic IDs
  progress: number;
  icon: string;
  color: string;
  status: 'active' | 'completed';
  quizQuestionsPerLesson?: number; // Số câu hỏi mỗi bài quiz (mặc định 10)
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
  quizQuestionsPerLesson: number = 10
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
      totalSubTopics,
      completedSubTopics: [],
      progress: 0,
      icon: COURSE_ICONS[courses.length % COURSE_ICONS.length],
      color: COURSE_COLORS[courses.length % COURSE_COLORS.length],
      status: 'active',
      quizQuestionsPerLesson,
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
    const quizResults = await getAllQuizResults();
    
    // Tính điểm
    const correctAnswers = questions.filter(
      (q, index) => userAnswers[index] === q.answerIndex
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

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
    await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(quizResults));
    
    console.log('✅ Quiz result saved:', newResult.id, `Score: ${score}%`);
    return newResult;
  } catch (error) {
    console.error('Error saving quiz result:', error);
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
    await AsyncStorage.multiRemove([STORAGE_KEYS.COURSES, STORAGE_KEYS.QUIZ_RESULTS]);
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
