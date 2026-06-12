"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Course,
  User,
  Enrollment,
  DiscussionMessage,
  Category,
  Notification,
  INITIAL_COURSES,
  INITIAL_USERS,
  INITIAL_ENROLLMENTS,
  INITIAL_DISCUSSIONS,
  INITIAL_CATEGORIES,
  INITIAL_NOTIFICATIONS,
  Lesson,
  QuizQuestion,
} from "@/lib/db-seed";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface LmsContextType {
  currentRole: "student" | "teacher" | "admin" | "developer";
  setCurrentRole: (role: "student" | "teacher" | "admin" | "developer") => void;
  currentUser: User;
  users: User[];
  courses: Course[];
  categories: Category[];
  enrollments: Enrollment[];
  discussions: DiscussionMessage[];
  notifications: Notification[];
  
  // Quiz progress / player state
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;

  // AI states
  aiChatHistory: Record<string, ChatMessage[]>; // lessonId -> messages
  aiSummaries: Record<string, string>; // lessonId -> summary
  aiQuizLoading: boolean;
  aiChatLoading: boolean;
  aiSummaryLoading: boolean;

  // Actions
  enrollInCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  submitCourseQuiz: (courseId: string, answers: Record<string, number>) => { score: number; total: number; passed: boolean };
  addDiscussion: (courseId: string, text: string) => void;
  createCourse: (course: Omit<Course, "id" | "teacherId">) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  addUser: (user: Omit<User, "id">) => void;
  deleteUser: (userId: string) => void;
  updateUser: (user: User) => void;
  addCategory: (name: string) => void;
  markNotificationRead: (id: string) => void;
  resetAllDb: () => void;

  // AI Core Triggers
  sendAiChatMessage: (courseTitle: string, lessonTitle: string, lessonId: string, userMessage: string) => Promise<void>;
  generateAiSummarize: (lessonId: string, lessonTitle: string, lessonContent: string) => Promise<void>;
  generateAiQuizForLesson: (courseId: string, lessonTitle: string, lessonContent: string) => Promise<void>;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

export function LmsProvider({ children }: { children: React.ReactNode }) {
  // Loaded state
  const [loaded, setLoaded] = useState(false);

  // States
  const [currentRole, setCurrentRoleInternal] = useState<"student" | "teacher" | "admin" | "developer">("student");
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Navigation Player items
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // AI Integration Cache
  const [aiChatHistory, setAiChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [aiQuizLoading, setAiQuizLoading] = useState(false);
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // Load from LocalStorage or seed defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("lms_current_role") as any;
      if (storedRole) setCurrentRoleInternal(storedRole);

      const storedUsers = localStorage.getItem("lms_users");
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      else setUsers(INITIAL_USERS);

      const storedCourses = localStorage.getItem("lms_courses");
      if (storedCourses) setCourses(JSON.parse(storedCourses));
      else setCourses(INITIAL_COURSES);

      const storedCategories = localStorage.getItem("lms_categories");
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      else setCategories(INITIAL_CATEGORIES);

      const storedEnrollments = localStorage.getItem("lms_enrollments");
      if (storedEnrollments) setEnrollments(JSON.parse(storedEnrollments));
      else setEnrollments(INITIAL_ENROLLMENTS);

      const storedDiscussions = localStorage.getItem("lms_discussions");
      if (storedDiscussions) setDiscussions(JSON.parse(storedDiscussions));
      else setDiscussions(INITIAL_DISCUSSIONS);

      const storedNotifications = localStorage.getItem("lms_notifications");
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      else setNotifications(INITIAL_NOTIFICATIONS);

      const storedAiChat = localStorage.getItem("lms_ai_chat");
      if (storedAiChat) setAiChatHistory(JSON.parse(storedAiChat));

      const storedAiSummaries = localStorage.getItem("lms_ai_summaries");
      if (storedAiSummaries) setAiSummaries(JSON.parse(storedAiSummaries));

      setLoaded(true);
    }
  }, []);

  // Save to LocalStorage helper
  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("lms_current_role", currentRole);
      localStorage.setItem("lms_users", JSON.stringify(users));
      localStorage.setItem("lms_courses", JSON.stringify(courses));
      localStorage.setItem("lms_categories", JSON.stringify(categories));
      localStorage.setItem("lms_enrollments", JSON.stringify(enrollments));
      localStorage.setItem("lms_discussions", JSON.stringify(discussions));
      localStorage.setItem("lms_notifications", JSON.stringify(notifications));
      localStorage.setItem("lms_ai_chat", JSON.stringify(aiChatHistory));
      localStorage.setItem("lms_ai_summaries", JSON.stringify(aiSummaries));
    }
  }, [loaded, currentRole, users, courses, categories, enrollments, discussions, notifications, aiChatHistory, aiSummaries]);

  // Derived current user metadata
  const currentUser: User = users.find(u => {
    if (currentRole === "student") return u.role === "student";
    if (currentRole === "teacher") return u.role === "teacher";
    return u.role === "admin";
  }) || {
    id: "user-1",
    name: "Học Viên Thử Nghiệm",
    email: "student@test.com",
    role: "student",
    avatar: "https://picsum.photos/seed/standard/100/100",
    dateCreated: "2026-01-01",
    status: "Active"
  };

  const setCurrentRole = (role: "student" | "teacher" | "admin" | "developer") => {
    setCurrentRoleInternal(role);
  };

  const enrollInCourse = (courseId: string) => {
    const exists = enrollments.some(e => e.userId === currentUser.id && e.courseId === courseId);
    if (!exists) {
      const newEnroll: Enrollment = {
        id: `enroll-${Date.now()}`,
        userId: currentUser.id,
        courseId: courseId,
        progress: 0,
        lessonsCompleted: [],
        completed: false
      };
      setEnrollments(prev => [...prev, newEnroll]);
      
      // Update UI feedback notification
      const course = courses.find(c => c.id === courseId);
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        title: "Đăng ký khóa học thành công!",
        description: `Bạn đã tham gia lớp '${course?.title || ""}' thành công. Hãy bắt đầu bài học đầu tiên!`,
        time: "Vừa xong",
        read: false,
        type: "success"
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    // Enroll if not already
    enrollInCourse(courseId);

    setEnrollments(prev => prev.map(e => {
      if (e.userId === currentUser.id && e.courseId === courseId) {
        if (e.lessonsCompleted.includes(lessonId)) return e;

        const updatedCompleted = [...e.lessonsCompleted, lessonId];
        const targetCourse = courses.find(c => c.id === courseId);
        const totalLessons = targetCourse?.lessons.length || 1;
        const newProgress = Math.round((updatedCompleted.length / totalLessons) * 100);

        return {
          ...e,
          lessonsCompleted: updatedCompleted,
          progress: newProgress,
          completed: newProgress === 100
        };
      }
      return e;
    }));
  };

  const submitCourseQuiz = (courseId: string, answers: Record<string, number>) => {
    const targetCourse = courses.find(c => c.id === courseId);
    if (!targetCourse) return { score: 0, total: 0, passed: false };

    let correctCount = 0;
    targetCourse.quizzes.forEach((quiz) => {
      if (answers[quiz.id] === quiz.correctAnswer) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / targetCourse.quizzes.length) * 100);
    const passed = scorePct >= 70;

    // Update enrollment score
    setEnrollments(prev => prev.map(e => {
      if (e.userId === currentUser.id && e.courseId === courseId) {
        return {
          ...e,
          score: scorePct
        };
      }
      return e;
    }));

    // Add completion notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: passed ? "Học xuất sắc! Vượt qua bài thi" : "Kết quả bài thi trắc nghiệm",
      description: `Khóa học '${targetCourse.title}': Đạt điểm số ${scorePct}% (${correctCount}/${targetCourse.quizzes.length} câu)`,
      time: "Vừa xong",
      read: false,
      type: passed ? "success" : "warning"
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { score: correctCount, total: targetCourse.quizzes.length, passed };
  };

  const addDiscussion = (courseId: string, text: string) => {
    const newMsg: DiscussionMessage = {
      id: `disc-${Date.now()}`,
      courseId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      text,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setDiscussions(prev => [...prev, newMsg]);
  };

  // Teacher actions
  const createCourse = (newCourseData: Omit<Course, "id" | "teacherId">) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `course-${Date.now()}`,
      teacherId: currentUser.id
    };
    setCourses(prev => [...prev, newCourse]);

    // Track category course count
    setCategories(prev => prev.map(cat => {
      if (cat.id === newCourse.category) {
        return { ...cat, courseCount: cat.courseCount + 1 };
      }
      return cat;
    }));

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: "Xuất bản khóa học mới",
      description: `Giáo viên ${currentUser.name} vừa đưa lớp học '${newCourse.title}' lên hệ thống.`,
      time: "Vừa xong",
      read: false,
      type: "info"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const deleteCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
    if (course) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === course.category) {
          return { ...cat, courseCount: Math.max(0, cat.courseCount - 1) };
        }
        return cat;
      }));
    }
  };

  // Admin actions
  const addUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addCategory = (name: string) => {
    const newCat: Category = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      courseCount: 0
    };
    setCategories(prev => [...prev, newCat]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resetAllDb = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      setUsers(INITIAL_USERS);
      setCourses(INITIAL_COURSES);
      setCategories(INITIAL_CATEGORIES);
      setEnrollments([]);
      setDiscussions(INITIAL_DISCUSSIONS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setAiChatHistory({});
      setAiSummaries({});
      setActiveCourseId(null);
      setActiveLessonId(null);
      setCurrentRole("student");
    }
  };

  // AI service triggers
  const sendAiChatMessage = async (courseTitle: string, lessonTitle: string, lessonId: string, userMessage: string) => {
    try {
      setAiChatLoading(true);

      // Append user's message locally first
      const currentHistory = aiChatHistory[lessonId] || [];
      const updatedHistory = [...currentHistory, { role: "user" as const, text: userMessage }];
      setAiChatHistory(prev => ({
        ...prev,
        [lessonId]: updatedHistory
      }));

      // Call route handler API
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          payload: {
            history: currentHistory,
            message: userMessage,
            courseTitle,
            lessonTitle
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiChatHistory(prev => ({
          ...prev,
          [lessonId]: [...(prev[lessonId] || []), { role: "model" as const, text: data.text }]
        }));
      } else {
        throw new Error(data.error || "AI Error");
      }

    } catch (err) {
      console.error(err);
      setAiChatHistory(prev => ({
        ...prev,
        [lessonId]: [...(prev[lessonId] || []), {
          role: "model" as const,
          text: "Xin lỗi, đã xảy ra sự cố kết nối AI. Vui lòng kiểm tra lại cấu hình hoặc tiếp tục đối thoại sau!"
        }]
      }));
    } finally {
      setAiChatLoading(false);
    }
  };

  const generateAiSummarize = async (lessonId: string, lessonTitle: string, lessonContent: string) => {
    try {
      setAiSummaryLoading(true);

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "summarize",
          payload: {
            title: lessonTitle,
            content: lessonContent
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiSummaries(prev => ({
          ...prev,
          [lessonId]: data.text
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setAiSummaries(prev => ({
        ...prev,
        [lessonId]: `### Lỗi: Không thể tóm tắt tài liệu tự động.\nChi tiết lỗi: ${err?.message || "Lỗi không xác định"}`
      }));
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const generateAiQuizForLesson = async (courseId: string, lessonTitle: string, lessonContent: string) => {
    try {
      setAiQuizLoading(true);

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_quiz",
          payload: {
            title: lessonTitle,
            content: lessonContent
          }
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.quizzes)) {
        // Map response array to course quizzes
        const formattedQuizzes: QuizQuestion[] = data.quizzes.map((q: any, idx: number) => ({
          id: `ai-quiz-${lessonTitle.toLowerCase().replace(/\s+/g, "-")}-${idx}-${Date.now()}`,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));

        setCourses(prev => prev.map(c => {
          if (c.id === courseId) {
            // Append or replace
            const existingQuizzes = c.quizzes.filter(q => !q.id.startsWith("ai-quiz"));
            return {
              ...c,
              quizzes: [...existingQuizzes, ...formattedQuizzes]
            };
          }
          return c;
        }));

        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          title: "Trí tuệ nhân tạo (AI) tạo câu hỏi thi!",
          description: `Đã sinh thành công ${formattedQuizzes.length} câu hỏi trắc nghiệm mới từ nội dung bài học. Hãy kiểm thử ngay!`,
          time: "Vừa xong",
          read: false,
          type: "success"
        };
        setNotifications(prev => [newNotif, ...prev]);
      } else {
        throw new Error(data.error || "Mã nhận dạng câu hỏi không đúng định dạng.");
      }
    } catch (err: any) {
      console.error("Quiz generate error:", err);
    } finally {
      setAiQuizLoading(false);
    }
  };

  return (
    <LmsContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        users,
        courses,
        categories,
        enrollments,
        discussions,
        notifications,
        activeCourseId,
        setActiveCourseId,
        activeLessonId,
        setActiveLessonId,
        aiChatHistory,
        aiSummaries,
        aiQuizLoading,
        aiChatLoading,
        aiSummaryLoading,
        enrollInCourse,
        completeLesson,
        submitCourseQuiz,
        addDiscussion,
        createCourse,
        updateCourse,
        deleteCourse,
        addUser,
        deleteUser,
        updateUser,
        addCategory,
        markNotificationRead,
        resetAllDb,
        sendAiChatMessage,
        generateAiSummarize,
        generateAiQuizForLesson
      }}
    >
      {children}
    </LmsContext.Provider>
  );
}

export function useLms() {
  const context = useContext(LmsContext);
  if (context === undefined) {
    throw new Error("useLms must be used within an LmsProvider");
  }
  return context;
}
