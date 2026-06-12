"use client";

import React, { useState } from "react";
import { useLms } from "@/providers/LmsProviders";
import { Course, Lesson, QuizQuestion } from "@/lib/db-seed";
import {
  BookOpen,
  Plus,
  Trash,
  Edit3,
  Users,
  Award,
  Video,
  FileText,
  Check,
  ChevronRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Inbox
} from "lucide-react";
import { motion } from "motion/react";

export default function TeacherDashboard() {
  const {
    courses,
    categories,
    enrollments,
    users,
    createCourse,
    updateCourse,
    deleteCourse
  } = useLms();

  // Selected state
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New Course fields
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("frontend");
  const [newLevel, setNewLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [newImageUrl, setNewImageUrl] = useState("https://picsum.photos/seed/default/600/400");

  // New Lesson fields
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lesTitle, setLesTitle] = useState("");
  const [lesDuration, setLesDuration] = useState("");
  const [lesContent, setLesContent] = useState("");
  const [lesPdfUrl, setLesPdfUrl] = useState("");

  // New Quiz fields
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [quizText, setQuizText] = useState("");
  const [quizOptA, setQuizOptA] = useState("");
  const [quizOptB, setQuizOptB] = useState("");
  const [quizOptC, setQuizOptC] = useState("");
  const [quizOptD, setQuizOptD] = useState("");
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState("");

  // Selected course object
  const activeCourse = courses.find(c => c.id === selectedCourseId);

  // Calculate aggregates
  const teacherCourses = courses; // show all for testing convenience
  const totalStudents = enrollments.length;
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
    : 0;

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createCourse({
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      level: newLevel,
      imageUrl: newImageUrl.trim(),
      lessons: [],
      quizzes: []
    });

    // Reset
    setNewTitle("");
    setNewDescription("");
    setNewImageUrl("https://picsum.photos/seed/default/600/400");
    setShowCreateForm(false);
  };

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !lesTitle.trim()) return;

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: lesTitle.trim(),
      duration: lesDuration.trim() || "10:00",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // default placeholder mp4
      pdfUrl: lesPdfUrl.trim() || undefined,
      content: lesContent.trim() || "Syllabus content placeholder."
    };

    const updated = {
      ...activeCourse,
      lessons: [...activeCourse.lessons, newLesson]
    };

    updateCourse(updated);
    
    // Reset
    setLesTitle("");
    setLesDuration("");
    setLesContent("");
    setLesPdfUrl("");
    setShowAddLesson(false);
  };

  const handleAddQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !quizText.trim()) return;

    const newQuiz: QuizQuestion = {
      id: `quiz-${Date.now()}`,
      questionText: quizText.trim(),
      options: [quizOptA.trim() || "Option A", quizOptB.trim() || "Option B", quizOptC.trim() || "Option C", quizOptD.trim() || "Option D"],
      correctAnswer: quizCorrect,
      explanation: quizExplanation.trim() || "Đáp án đúng theo tài liệu học tập chuẩn của khoá học."
    };

    const updated = {
      ...activeCourse,
      quizzes: [...activeCourse.quizzes, newQuiz]
    };

    updateCourse(updated);

    // Reset
    setQuizText("");
    setQuizOptA("");
    setQuizOptB("");
    setQuizOptC("");
    setQuizOptD("");
    setQuizCorrect(0);
    setQuizExplanation("");
    setShowAddQuiz(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này và toàn bộ bài giảng kèm theo?")) {
      deleteCourse(courseId);
      if (selectedCourseId === courseId) {
        setSelectedCourseId(null);
      }
    }
  };

  return (
    <div className="py-6 space-y-8" id="teacher_workspace">
      
      {/* 1. Header Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Khóa Học Đang Dạy</span>
            <h4 className="text-xl font-bold font-sans text-gray-900 mt-1">{teacherCourses.length} Lớp</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Học Sinh Đăng Ký</span>
            <h4 className="text-xl font-bold font-sans text-gray-900 mt-1">{totalStudents} Học viên</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Tiến Độ Trung Bình</span>
            <h4 className="text-xl font-bold font-sans text-gray-900 mt-1">{avgProgress}% Hoàn thành</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Chờ Chấm Điểm</span>
            <h4 className="text-xl font-bold font-sans text-gray-900 mt-1">0 Bài nộp</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 2. Main Two-column partition: Course list vs Course administration workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Course inventory listing and creation controls */}
        <div className="lg:col-span-1 glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 font-sans">Danh Sách Quản Lý</h3>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-xs inline-flex items-center space-x-1"
              id="show_create_course_panel"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo Khoá Học</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {teacherCourses.length === 0 ? (
              <p className="text-gray-400 text-center py-6 text-xs font-light">Chưa cấu hình khoá học nào</p>
            ) : (
              teacherCourses.map(course => {
                const active = course.id === selectedCourseId;
                const progressCount = enrollments.filter(e => e.courseId === course.id).length;

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setShowCreateForm(false);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex justify-between items-center transition-all ${
                      active
                        ? "bg-blue-500/10 border-blue-200/50 text-blue-700"
                        : "glass-dark border-transparent hover:bg-white/40 text-gray-700"
                    }`}
                  >
                    <div className="space-y-0.5 overflow-hidden text-left flex-1">
                      <p className="font-bold truncate">{course.title}</p>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        {categories.find(c => c.id === course.category)?.name} • {course.lessons.length} Bài
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 ml-2">
                      <span className="text-[10px] font-mono text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded-sm">
                        {progressCount} học viên
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.id);
                        }}
                        className="p-1 hover:text-red-500 hover:bg-red-50 rounded"
                        title="Xóa khóa học"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Course content administration terminal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. Create course form panel */}
          {showCreateForm && (
            <div className="glass p-6 rounded-2xl space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <h4 className="font-bold text-sm text-gray-900 font-sans">Khai báo khóa học mới</h4>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-900 text-xs"
                >
                  Hủy bỏ
                </button>
              </div>

              <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500">Tên khóa học</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Master React Native in 30 Days"
                      className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500">Danh mục chuyên ngành</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500">Cấp độ tiếp cận</label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                    >
                      <option value="Beginner">Beginner (Cơ bản)</option>
                      <option value="Intermediate">Intermediate (Trung cấp)</option>
                      <option value="Advanced">Advanced (Nâng cao)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500">Ảnh banner bìa (Url)</label>
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="URL ảnh bìa"
                      className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500">Mô tả tóm lược khóa học</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Mô tả tóm tắt nội dung và mục tiêu đầu ra của khoá học..."
                    className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-50">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-100"
                    id="submit_new_course_frm"
                  >
                    Lưu trữ & Xuất bản 🌐
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* B. Overview detail & management cards for selected course */}
          {activeCourse ? (
            <div className="space-y-6 text-left">
              
              {/* Course Title metadata card */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                  Quản lý hành chính học thuật
                </span>
                <h3 className="text-lg font-bold font-sans">{activeCourse.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{activeCourse.description}</p>
                
                <div className="flex items-center space-x-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>Mức độ: <strong>{activeCourse.level}</strong></span>
                  <span>Danh mục: <strong>{categories.find(c => c.id === activeCourse.category)?.name}</strong></span>
                </div>
              </div>

              {/* 1. Lessons control manager */}
              <div className="glass p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                    Chương trình học bài giảng ({activeCourse.lessons.length} bài học)
                  </h4>
                  <button
                    onClick={() => setShowAddLesson(!showAddLesson)}
                    className="px-2 py-1 text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md font-bold"
                  >
                    + Thêm Bài Học mới
                  </button>
                </div>

                {/* Sub-form: Add Lesson form */}
                {showAddLesson && (
                  <form onSubmit={handleAddLessonSubmit} className="p-4 rounded-xl border border-blue-50 bg-blue-50/10 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold">Tiêu đề bài viết</label>
                        <input
                          type="text"
                          required
                          value={lesTitle}
                          onChange={(e) => setLesTitle(e.target.value)}
                          placeholder="e.g. 1. Giới thiệu tổng quan"
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold">Thời lượng video</label>
                        <input
                          type="text"
                          value={lesDuration}
                          placeholder="e.g. 15:30"
                          onChange={(e) => setLesDuration(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">PDF giáo trình link (Url - Optional)</label>
                      <input
                        type="text"
                        value={lesPdfUrl}
                        onChange={(e) => setLesPdfUrl(e.target.value)}
                        placeholder="Link document PDF"
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Nội dung chi tiết (Markdown)</label>
                      <textarea
                        rows={5}
                        value={lesContent}
                        onChange={(e) => setLesContent(e.target.value)}
                        placeholder="Cung cấp nội dung văn bản giáo án chỉ lý thuyết chính thức..."
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input font-mono"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddLesson(false)}
                        className="px-2.5 py-1 glass text-gray-600 rounded-md text-[10px]"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-[10px] font-bold"
                      >
                        Xác nhận thêm
                      </button>
                    </div>
                  </form>
                )}

                {/* Lessons list display */}
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {activeCourse.lessons.length === 0 ? (
                    <p className="text-gray-400 text-xs py-4 text-center font-light">Chưa có bài học nào được tải lên</p>
                  ) : (
                    activeCourse.lessons.map((les, idx) => (
                      <div key={les.id} className="p-3 glass-dark border-transparent rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-gray-400 font-mono">{idx + 1}</span>
                          <div>
                            <p className="font-semibold text-gray-800">{les.title}</p>
                            <span className="text-[10px] text-gray-400 block font-mono">{les.duration}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider block">
                            Active
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* 2. Quizzes control manager */}
              <div className="glass p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                    Bộ câu hỏi ôn tập kiểm tra ({activeCourse.quizzes.length} câu hỏi)
                  </h4>
                  <button
                    onClick={() => setShowAddQuiz(!showAddQuiz)}
                    className="px-2 py-1 text-[10px] text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md font-bold"
                  >
                    + Tạo câu hỏi thi mới
                  </button>
                </div>

                {/* Sub-form: Add Quiz question */}
                {showAddQuiz && (
                  <form onSubmit={handleAddQuizSubmit} className="p-4 rounded-xl border border-purple-50 bg-purple-50/10 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Nội dung câu hỏi trắc nghiệm</label>
                      <input
                        type="text"
                        required
                        value={quizText}
                        onChange={(e) => setQuizText(e.target.value)}
                        placeholder="e.g. Tại sao nên dùng Next.js App Router?"
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400">Đáp án A</label>
                        <input
                          type="text"
                          required
                          value={quizOptA}
                          onChange={(e) => setQuizOptA(e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg text-xs glass-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400">Đáp án B</label>
                        <input
                          type="text"
                          required
                          value={quizOptB}
                          onChange={(e) => setQuizOptB(e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg text-xs glass-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400">Đáp án C</label>
                        <input
                          type="text"
                          required
                          value={quizOptC}
                          onChange={(e) => setQuizOptC(e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg text-xs glass-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400">Đáp án D</label>
                        <input
                          type="text"
                          required
                          value={quizOptD}
                          onChange={(e) => setQuizOptD(e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg text-xs glass-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold">Lựa chọn đúng</label>
                        <select
                          value={quizCorrect}
                          onChange={(e) => setQuizCorrect(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input"
                        >
                          <option value={0}>Đáp án A</option>
                          <option value={1}>Đáp án B</option>
                          <option value={2}>Đáp án C</option>
                          <option value={3}>Đáp án D</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold">Giải thích đáp án</label>
                        <input
                          type="text"
                          value={quizExplanation}
                          onChange={(e) => setQuizExplanation(e.target.value)}
                          placeholder="Giải thích vì sao đáp án này đúng..."
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs glass-input"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddQuiz(false)}
                        className="px-2.5 py-1 glass text-gray-600 rounded-md text-[10px]"
                      >
                        Huỷ
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-purple-600 text-white rounded-md text-[10px] font-bold"
                      >
                        Xác nhận thêm
                      </button>
                    </div>
                  </form>
                )}

                {/* Quizzes list display */}
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {activeCourse.quizzes.length === 0 ? (
                    <p className="text-gray-400 text-xs py-4 text-center font-light">Chưa có câu hỏi thi trắc nghiệm</p>
                  ) : (
                    activeCourse.quizzes.map((quiz, idx) => (
                      <div key={quiz.id} className="p-3 glass-dark border-transparent rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-gray-800 text-left">
                            <span className="text-purple-600 font-bold font-mono mr-1">Q{idx + 1}.</span>
                            {quiz.questionText}
                          </p>
                          <span className="text-[9px] font-bold font-mono bg-green-100 text-green-700 px-1 rounded">
                            Đáp án {["A", "B", "C", "D"][quiz.correctAnswer]}
                          </span>
                        </div>
                        <ul className="grid grid-cols-2 gap-1.5 text-[10px] text-gray-500 font-light text-left pl-4 list-disc">
                          {quiz.options.map((opt, oIdx) => (
                            <li key={oIdx} className={quiz.correctAnswer === oIdx ? "text-green-700 font-semibold" : ""}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-20 glass rounded-2xl text-gray-400">
              <Sliders className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-gray-900 font-sans">Màn hình Biên soạn bài giảng</h4>
              <p className="text-xs text-gray-500 mt-1">Vui lòng lựa chọn một lớp học bên lề trái để bắt đầu quản lý nội dung tài liệu, bài giảng và câu hỏi thi!</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
