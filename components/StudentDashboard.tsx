"use client";

import React, { useState } from "react";
import { useLms } from "@/providers/LmsProviders";
import { Course, Lesson, QuizQuestion } from "@/lib/db-seed";
import {
  BookOpen,
  Play,
  FileText,
  MessageSquare,
  Award,
  ChevronRight,
  Brain,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Send,
  Loader,
  X,
  BookOpenCheck,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function StudentDashboard() {
  const {
    courses,
    categories,
    enrollments,
    discussions,
    activeCourseId,
    setActiveCourseId,
    activeLessonId,
    setActiveLessonId,
    enrollInCourse,
    completeLesson,
    submitCourseQuiz,
    addDiscussion,
    aiChatHistory,
    aiSummaries,
    aiChatLoading,
    aiSummaryLoading,
    aiQuizLoading,
    sendAiChatMessage,
    generateAiSummarize,
    generateAiQuizForLesson
  } = useLms();

  // Navigation states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"video" | "summary" | "quiz" | "discussions">("video");
  const [userChatInput, setUserChatInput] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  // Filter courses
  const filteredCourses = selectedCategory === "all"
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  // Active Course/Lesson derived
  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeLesson = activeCourse?.lessons.find(l => l.id === activeLessonId) || activeCourse?.lessons[0];
  const activeEnrollment = enrollments.find(e => e.courseId === activeCourseId);

  // Handle category count dynamically
  const getEnrollmentProgress = (courseId: string) => {
    const enroll = enrollments.find(e => e.courseId === courseId);
    return enroll ? enroll.progress : 0;
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  const handleLessonSelect = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setQuizResult(null);
    setSelectedAnswers({});
  };

  const handleCompleteCurrentLesson = () => {
    if (activeCourse && activeLesson) {
      completeLesson(activeCourse.id, activeLesson.id);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCourse) {
      const res = submitCourseQuiz(activeCourse.id, selectedAnswers);
      setQuizResult(res);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCourseId && commentInput.trim() !== "") {
      addDiscussion(activeCourseId, commentInput.trim());
      setCommentInput("");
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim() || !activeCourse || !activeLesson) return;
    
    sendAiChatMessage(
      activeCourse.title,
      activeLesson.title,
      activeLesson.id,
      userChatInput.trim()
    );
    setUserChatInput("");
  };

  const triggerSummarize = () => {
    if (activeLesson) {
      generateAiSummarize(activeLesson.id, activeLesson.title, activeLesson.content);
    }
  };

  const triggerAiQuiz = () => {
    if (activeCourse && activeLesson) {
      generateAiQuizForLesson(activeCourse.id, activeLesson.title, activeLesson.content);
      setSelectedAnswers({});
      setQuizResult(null);
    }
  };

  return (
    <div className="py-6" id="student_workspace">
      
      {/* 1. Main Course Directory view when no course is being played */}
      {!activeCourseId ? (
        <div className="space-y-8">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 px-6 py-10 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-100 tracking-wider mb-3">
                🤖 Đã tích hợp Gemini AI v3.5
              </span>
              <h2 className="font-sans text-3xl font-extrabold tracking-tight md:text-4xl">
                Chào mừng bạn đến với thế giới học tập số hóa!
              </h2>
              <p className="mt-3 text-sm md:text-base text-blue-100/90 leading-relaxed font-sans font-light">
                Hệ thống LMS được tối ưu hóa với công nghệ học tập thông minh. Tóm tắt tài liệu tự động, trò chuyện cùng AI Assistant và giải quyết các bài kiểm tra thực nghiệm tức thì.
              </p>
            </div>
            
            {/* Decors */}
            <div className="absolute right-0 bottom-0 h-40 w-40 translate-x-12 translate-y-12 rounded-full bg-blue-500/20 blur-3xl"></div>
          </div>

          {/* Catalog Head / Filter Category list */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-sans">Danh Mục Khóa Học</h3>
                <p className="text-xs text-gray-500 mt-1">Lựa chọn chuyên ngành của bạn để khám phá các bài giảng chất lượng cao</p>
              </div>
              
              {/* Category buttons list */}
              <div className="flex flex-wrap gap-1.5 mt-3 sm:mt-0 glass-dark p-1 rounded-xl border border-white/20 self-start">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCategory === "all" ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Tất cả
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat.id ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12 glass rounded-3xl">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900">Không có khóa học nào</h3>
                <p className="mt-1 text-xs text-gray-500">Giảng viên đang biên tập tài liệu và sẽ sớm cung cấp bài học mới.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map(course => {
                  const enrolled = isEnrolled(course.id);
                  const progress = getEnrollmentProgress(course.id);

                  return (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedCourseDetail(course)}
                      className="group flex flex-col overflow-hidden rounded-2xl glass transition-shadow hover:shadow-md cursor-pointer"
                    >
                      <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full shadow-xs uppercase tracking-wide text-white ${
                          course.level === "Advanced" ? "bg-red-500" : course.level === "Intermediate" ? "bg-amber-500" : "bg-green-500"
                        }`}>
                          {course.level}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-blue-600">
                          {categories.find(c => c.id === course.category)?.name || "Khoá học"}
                        </span>
                        <h4 className="mt-1.5 font-sans font-bold text-sm text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h4>
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                            <Play className="h-3.5 w-3.5 text-gray-400" />
                            <span>{course.lessons.length} Bài học</span>
                          </div>

                          {enrolled ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-blue-600">{progress}%</span>
                            </div>
                          ) : (
                            <span className="text-[11px] font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                              Xem chi tiết <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Course Detail information and syllabus modal view */}
          {selectedCourseDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl overflow-hidden rounded-3xl glass shadow-2xl flex flex-col max-h-[85vh]"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  <img
                    src={selectedCourseDetail.imageUrl}
                    alt={selectedCourseDetail.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/45 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                      {selectedCourseDetail.level}
                    </span>
                    <h3 className="text-xl font-bold font-sans mt-1 leading-tight">{selectedCourseDetail.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedCourseDetail(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold">Mô tả khóa học</h4>
                    <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">{selectedCourseDetail.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Syllabus bài giảng ({selectedCourseDetail.lessons.length} Chương)</h4>
                    <div className="space-y-2">
                      {selectedCourseDetail.lessons.map((les, index) => (
                        <div key={les.id} className="flex items-center justify-between p-3 rounded-xl glass-dark hover:bg-white/35 transition-colors">
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-mono font-bold text-[10px]">
                              {index + 1}
                            </div>
                            <span className="font-semibold text-gray-800">{les.title}</span>
                          </div>
                          <span className="font-mono text-[10px] text-gray-400">{les.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/20 p-4 glass-dark flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCourseDetail(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Đóng
                  </button>

                  {isEnrolled(selectedCourseDetail.id) ? (
                    <button
                      onClick={() => {
                        const targetCourseId = selectedCourseDetail.id;
                        setSelectedCourseDetail(null);
                        setActiveCourseId(targetCourseId);
                        const course = courses.find(c => c.id === targetCourseId);
                        if (course && course.lessons.length > 0) {
                          setActiveLessonId(course.lessons[0].id);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors"
                    >
                      Vào Học Ngay 👀
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        enrollInCourse(selectedCourseDetail.id);
                        const targetCourseId = selectedCourseDetail.id;
                        setSelectedCourseDetail(null);
                        setActiveCourseId(targetCourseId);
                        const course = courses.find(c => c.id === targetCourseId);
                        if (course && course.lessons.length > 0) {
                          setActiveLessonId(course.lessons[0].id);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors"
                    >
                      Đăng Ký & Học Ngay 🚀
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}

        </div>
      ) : (

        /* 3. Dynamic Interactive Course Player Workspace */
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          {/* Back button */}
          <div className="xl:col-span-4">
            <button
              onClick={() => {
                setActiveCourseId(null);
                setActiveLessonId(null);
                setQuizResult(null);
                setSelectedAnswers({});
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
              id="back_to_catalog"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang danh sách khóa học</span>
            </button>
            <h2 className="mt-2 text-lg font-bold font-sans text-gray-900">{activeCourse?.title}</h2>
          </div>

          {/* Left Column: Syllabus / Lessons List Nav (1/4 space) */}
          <div className="xl:col-span-1 glass p-4 rounded-2xl space-y-4">
            <div>
              <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-widest">Danh mục chương học</h3>
              <div className="mt-3.5 space-y-2">
                {activeCourse?.lessons.map((les, index) => {
                  const done = activeEnrollment?.lessonsCompleted.includes(les.id);
                  const active = les.id === (activeLesson?.id || "");

                  return (
                    <div
                      key={les.id}
                      onClick={() => handleLessonSelect(les.id)}
                      className={`group flex items-start justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        active
                          ? "bg-blue-500/10 border-blue-200/50 text-blue-700 font-semibold"
                          : "glass-dark border-transparent text-gray-700 hover:bg-white/40"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="mt-0.5">
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          ) : (
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-300 text-[9px] font-mono font-semibold text-gray-400">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-1 truncate text-left">{les.title}</span>
                      </div>
                      <span className="font-mono text-[9px] text-gray-400 shrink-0 self-center ml-1">{les.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Assistant quick control box */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <span className="font-semibold text-xs text-gray-400 uppercase tracking-widest block">Tính năng AI hỗ trợ</span>
              
              <button
                onClick={triggerSummarize}
                disabled={aiSummaryLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-blue-100 bg-linear-to-r from-blue-50/20 to-indigo-50/20 text-xs hover:from-blue-50 hover:to-indigo-50 transition-colors"
                id="ai_summarize_btn"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="font-semibold text-blue-700 text-left">Tóm tắt bài này</span>
                </div>
                {aiSummaryLoading ? (
                  <Loader className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                )}
              </button>

              <button
                onClick={triggerAiQuiz}
                disabled={aiQuizLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-purple-100 bg-linear-to-r from-purple-50/20 to-pink-50/20 text-xs hover:from-purple-50 hover:to-pink-50 transition-colors"
                id="ai_quiz_gen_btn"
              >
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-700 text-left">Tạo bài thi AI</span>
                </div>
                {aiQuizLoading ? (
                  <Loader className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                )}
              </button>
            </div>
          </div>

          {/* Center Column: Video Player, Lesson details tabs, Exercises (2/4 space) */}
          <div className="xl:col-span-2 space-y-5">
            
            {/* Visual Media Video Block Player */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-slate-950 shadow-lg aspect-video">
              {activeLesson?.videoUrl ? (
                <video
                  key={activeLesson.id}
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster="https://picsum.photos/seed/learn/800/450"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-white text-center">
                  <Play className="w-12 h-12 text-blue-500 mb-2" />
                  <p className="text-xs">Không tìm thấy nguồn video bài học</p>
                </div>
              )}
            </div>

            {/* Content Display/Interaction Tabs list headers */}
            <div className="glass rounded-2xl overflow-hidden shadow-xs">
              
              {/* Tab Header list */}
              <div className="flex border-b border-white/20 bg-white/25 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 text-left transition-colors ${
                    activeTab === "video"
                      ? "border-blue-600 text-blue-700 bg-white/40 backdrop-blur-xs"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bài học</span>
                </button>
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 text-left transition-colors ${
                    activeTab === "summary"
                      ? "border-blue-600 text-blue-700 bg-white/40 backdrop-blur-xs"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tài liệu (PDF/AI)</span>
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 text-left transition-colors ${
                    activeTab === "quiz"
                      ? "border-blue-600 text-blue-700 bg-white/40 backdrop-blur-xs"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Bài tập kiểm tra</span>
                </button>
                <button
                  onClick={() => setActiveTab("discussions")}
                  className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 text-left transition-colors ${
                    activeTab === "discussions"
                      ? "border-blue-600 text-blue-700 bg-white/40 backdrop-blur-xs"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Học tập thảo luận</span>
                </button>
              </div>

              {/* Tab Content window */}
              <div className="p-5 max-h-[500px] overflow-y-auto">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: LESSON TEXT INFO */}
                  {activeTab === "video" && (
                    <motion.div
                      key="lesson-text"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 text-xs text-gray-700 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                        <h3 className="font-bold text-sm text-gray-900">{activeLesson?.title}</h3>
                        <button
                          onClick={handleCompleteCurrentLesson}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold hover:bg-green-100 transition-all shadow-xs"
                          id="mark_complete_step"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Hoàn thành tệp bài học</span>
                        </button>
                      </div>

                      {/* Render text mockup */}
                      <div className="prose prose-sm max-w-none text-xs leading-relaxed space-y-4">
                        <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-50 flex items-start space-x-2">
                          <span className="text-xl">🎓</span>
                          <p className="text-blue-900 leading-normal font-sans">
                            Bài học này chứa các giải thích mang tính hệ thống. Hãy đọc phần tệp hướng dẫn dưới đây và tiếp tục hoàn thiện bài kiểm tra trắc nghiệm tương ứng.
                          </p>
                        </div>
                        
                        <div className="whitespace-pre-wrap font-sans">
                          {activeLesson?.content}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: PDF & AI SUMMARY INTERACTIVE WORKSPACE */}
                  {activeTab === "summary" && (
                    <motion.div
                      key="summary-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5 text-left"
                    >
                      {/* Live PDF document link if present */}
                      {activeLesson?.pdfUrl && (
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="p-2.5 bg-red-100 text-red-600 rounded-lg">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-xs">Tài liệu đính kèm (Syllabus PDF)</p>
                              <span className="text-[10px] text-gray-400">Tệp đọc chính thức bài tập nghiên cứu</span>
                            </div>
                          </div>
                          
                          <a
                            href={activeLesson.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-all shadow-xs"
                          >
                            <span>Mở Raw PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* AI Generated summary box */}
                      <div className="border border-blue-100 rounded-2xl bg-linear-to-b from-blue-50/30 to-white overflow-hidden">
                        <div className="bg-blue-50/60 p-3 px-4 border-b border-blue-50 flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs">
                            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                            <span className="font-bold text-blue-900">Bản tóm tắt tự động bởi AI Gemini</span>
                          </div>
                          
                          {!aiSummaries[activeLesson?.id || ""] && (
                            <button
                              onClick={triggerSummarize}
                              disabled={aiSummaryLoading}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg disabled:opacity-50 inline-flex items-center space-x-1"
                              id="get_summary_trigger"
                            >
                              {aiSummaryLoading ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <span>Tạo tóm tắt ngay ✨</span>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="p-4 text-xs text-gray-700 space-y-2">
                          {aiSummaryLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-2">
                              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                              <p className="text-[10px] text-gray-400">Gemini đang đọc tài liệu và trích xuất nội dung cốt lõi...</p>
                            </div>
                          ) : aiSummaries[activeLesson?.id || ""] ? (
                            <div className="whitespace-pre-wrap font-sans leading-relaxed text-xs">
                              {aiSummaries[activeLesson?.id || ""]}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-gray-400">
                              <p className="text-[11px]">Chưa có bản tóm tắt nào cho bài học này.</p>
                              <p className="text-[10px] mt-1 text-gray-400">Chọn nút &apos;Tạo tóm tắt ngay&apos; ở góc trên để phân tích toàn vẹn bài học bằng AI!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: COURSE QUIZZES & AUTOMATIC GRADING VIEW */}
                  {activeTab === "quiz" && (
                    <motion.div
                      key="quiz-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-left space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-2">
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">Bài kiểm tra đánh giá tự động</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Vượt qua bài thi với tỷ lệ &gt;= 70% để hoàn thiện thang điểm học tập</p>
                        </div>
                        <button
                          onClick={triggerAiQuiz}
                          disabled={aiQuizLoading}
                          className="px-2.5 py-1 text-[10px] text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold rounded-lg border border-purple-200 inline-flex items-center space-x-1"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span>Sinh câu hỏi mới qua AI</span>
                        </button>
                      </div>

                      {activeCourse?.quizzes && activeCourse.quizzes.length > 0 ? (
                        <form onSubmit={handleQuizSubmit} className="space-y-5">
                          {activeCourse.quizzes.map((quiz, qIdx) => (
                            <div key={quiz.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2.5">
                              <span className="text-[10px] font-mono font-bold text-blue-600 block">Câu hỏi {qIdx + 1}</span>
                              <p className="text-xs font-semibold text-gray-800 leading-normal">{quiz.questionText}</p>
                              
                              <div className="grid grid-cols-1 gap-2 mt-2">
                                {quiz.options.map((opt, oIdx) => {
                                  const checked = selectedAnswers[quiz.id] === oIdx;
                                  const showExplanation = quizResult !== null;
                                  const isCorrectOption = quiz.correctAnswer === oIdx;

                                  let optionStyle = "border-white/20 glass text-gray-700 hover:bg-white/40";
                                  if (checked) {
                                    optionStyle = "border-blue-500 bg-blue-100/50 text-blue-700";
                                  }

                                  if (showExplanation) {
                                    if (isCorrectOption) {
                                      optionStyle = "border-green-500 bg-green-50 text-green-700 font-semibold";
                                    } else if (checked) {
                                      optionStyle = "border-red-300 bg-red-50 text-red-700";
                                    } else {
                                      optionStyle = "opacity-60 border-gray-150 text-gray-400";
                                    }
                                  }

                                  return (
                                    <label
                                      key={oIdx}
                                      className={`flex items-start space-x-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${optionStyle}`}
                                    >
                                      <input
                                        type="radio"
                                        name={`quiz-${quiz.id}`}
                                        value={oIdx}
                                        checked={checked}
                                        disabled={quizResult !== null}
                                        onChange={() => {
                                          setSelectedAnswers(prev => ({
                                            ...prev,
                                            [quiz.id]: oIdx
                                          }));
                                        }}
                                        className="mt-0.5 shrink-0 accent-blue-600"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>

                              {/* Quiz explanation card */}
                              {quizResult && (
                                <div className="mt-3.5 p-3 rounded-lg bg-blue-50/40 border border-blue-50 text-[11px] text-gray-600 leading-relaxed font-light">
                                  <strong className="text-blue-900 block font-semibold mb-1">💡 Lời giải thích:</strong>
                                  {quiz.explanation}
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Quiz grading result prompt card */}
                          {quizResult ? (
                            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs ${
                              quizResult.passed ? 'bg-green-50 border-green-200 text-green-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                            }`}>
                              <div>
                                <h5 className="font-bold text-sm">
                                  {quizResult.passed ? "🎉 Đạt điểm xuất sắc!" : "⚠️ Thử sức lại một lần nữa!"}
                                </h5>
                                <p className="mt-0.5 font-light">Kết quả bài thi: Đạt điểm số {Math.round((quizResult.score / quizResult.total) * 100)}% ({quizResult.score} / {quizResult.total} câu trả lời đúng)</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setQuizResult(null);
                                  setSelectedAnswers({});
                                }}
                                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] self-start sm:self-center transition-colors"
                              >
                                Thi lại bài học
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-200 transition-colors"
                                id="submit_examination_test"
                              >
                                Nộp bài thi của tôi 🎯
                              </button>
                            </div>
                          )}
                        </form>
                      ) : (
                        <div className="text-center py-10 text-gray-400">
                          Không có câu hỏi thi nào cho khóa học này. Hãy thử bấm nút &apos;Sinh câu hỏi bằng AI&apos; để tự sinh các câu hỏi thi chất lượng!
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 4: DISCUSSIONS FORUM COMMENTS */}
                  {activeTab === "discussions" && (
                    <motion.div
                      key="discussions-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-left space-y-4"
                    >
                      <h4 className="font-bold text-xs text-gray-900">Giải đáp thắc mắc lớp học ({discussions.filter(msg => msg.courseId === activeCourseId).length})</h4>

                      {/* Render list of discussion posts */}
                      <div className="space-y-3.5 pr-1 max-h-72 overflow-y-auto">
                        {discussions.filter(msg => msg.courseId === activeCourseId).length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-xs text-sans font-light">
                            Học đàn chưa bắt đầu thảo luận. Gửi ngay câu hỏi đầu tiên của bạn ở biểu mẫu bên dưới!
                          </div>
                        ) : (
                          discussions
                            .filter(msg => msg.courseId === activeCourseId)
                            .map((msg) => (
                              <div key={msg.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3">
                                <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[11px]">
                                  {msg.userName.charAt(0)}
                                </div>
                                <div className="space-y-1 overflow-hidden flex-1">
                                  <div className="flex items-center space-x-1.5 justify-start">
                                    <span className="font-semibold text-gray-900 text-xs">{msg.userName}</span>
                                    <span className={`text-[8px] font-bold uppercase px-1 rounded ${
                                      msg.userRole === "teacher" ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {msg.userRole === "teacher" ? "Giáo Viên" : "Học Viên"}
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-mono">{msg.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-gray-700 font-light leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                </div>
                              </div>
                            ))
                        )}
                      </div>

                      {/* Comment submit form */}
                      <form onSubmit={handlePostComment} className="flex gap-2 border-t border-white/20 pt-3">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Đặt câu hỏi thảo luận về bài học này..."
                          className="flex-1 px-3 py-2 rounded-xl text-xs glass-input focus:outline-hidden focus:border-blue-400 transition-colors"
                        />
                        <button
                          type="submit"
                          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* Right Column: AI Chatbot Learning Companion Sidebar (1/4 space) */}
          <div className="xl:col-span-1 glass rounded-2xl p-4 flex flex-col h-[525px] overflow-hidden" id="ai-companion-bar">
            <div className="flex items-center space-x-2 border-b border-white/20 pb-3 mb-3 shrink-0 text-left">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 animate-pulse">
                <Brain className="w-4.5 h-4.5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-sans font-bold text-xs text-gray-900 truncate">Trợ Lý Ảo Gemini</h4>
                <div className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
                  <p className="text-[9px] text-green-600 font-bold font-mono">ĐỒNG HÀNH LIVE</p>
                </div>
              </div>
            </div>

            {/* Chatbot conversation list */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1 text-left" id="chatbot_history_list">
              {(aiChatHistory[activeLesson?.id || ""] || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-400">
                  <Sparkles className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-[11px] leading-relaxed">Chào bạn! Tôi là trợ lý ảo Gemini của lớp học.</p>
                  <p className="text-[10px] mt-1 text-gray-400">Hãy hỏi tôi bất kỳ điều gì về bài học &apos;{activeLesson?.title || ""}&apos; vừa đọc. Tôi sẽ giải thích tường tận!</p>
                </div>
              ) : (
                (aiChatHistory[activeLesson?.id || ""] || []).map((msg, idx) => (
                  <div key={idx} className={`flex items-start space-x-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "model" && (
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                        G
                      </div>
                    )}
                    <div className={`p-2.5 rounded-2xl max-w-[85%] text-[11px] leading-relaxed select-text ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none text-left"
                        : "bg-gray-100/80 text-gray-800 rounded-tl-none text-left"
                    }`}>
                      <div className="whitespace-pre-wrap font-sans select-text">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}

              {aiChatLoading && (
                <div className="flex items-start space-x-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Loader className="w-3 h-3 text-blue-600 animate-spin" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl rounded-tl-none p-2.5 max-w-[85%]">
                    <div className="flex space-x-1.5 py-1">
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chatbot input panel */}
            <form onSubmit={handleSendChatMessage} className="flex gap-1.5 border-t border-white/20 pt-3 shrink-0">
              <input
                type="text"
                value={userChatInput}
                disabled={aiChatLoading}
                onChange={(e) => setUserChatInput(e.target.value)}
                placeholder="Trao đổi cùng Gemini..."
                className="flex-1 px-2.5 py-2 glass-input rounded-xl text-[11px] focus:outline-hidden focus:border-blue-400 transition-colors disabled:opacity-50"
                id="chatbot_input_box"
              />
              <button
                type="submit"
                disabled={aiChatLoading || !userChatInput.trim()}
                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
