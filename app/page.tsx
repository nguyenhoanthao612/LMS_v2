"use client";

import React from "react";
import { useLms } from "@/providers/LmsProviders";
import Navbar from "@/components/Navbar";
import StudentDashboard from "@/components/StudentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import DevDashboard from "@/components/DevDashboard";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Sliders, Server, Code, GraduationCap } from "lucide-react";

export default function Page() {
  const { currentRole } = useLms();

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6" id="main_lms_grid_body">
        
        {/* Dynamic view header guide banner */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 glass p-4 rounded-2xl">
          <div className="flex items-center space-x-3 text-left">
            <div className={`p-2 rounded-xl text-white ${
              currentRole === "student" ? "bg-green-600" :
              currentRole === "teacher" ? "bg-amber-600" :
              currentRole === "admin" ? "bg-purple-600" :
              "bg-blue-600"
            }`}>
              {currentRole === "student" && <GraduationCap className="w-5 h-5" />}
              {currentRole === "teacher" && <Sliders className="w-5 h-5" />}
              {currentRole === "admin" && <Server className="w-5 h-5" />}
              {currentRole === "developer" && <Code className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono font-bold uppercase leading-none">
                Chế độ phân quyền active
              </p>
              <h1 className="text-sm font-bold text-gray-800 font-sans mt-0.5">
                {currentRole === "student" && "Bảng điều khiển Học Viên"}
                {currentRole === "teacher" && "Bảng điều khiển Giảng Viên (Giáo Án)"}
                {currentRole === "admin" && "Hệ thống Quản Trị Viên (Admin)"}
                {currentRole === "developer" && "Tài liệu kỹ thuật Use Cases & Schemas"}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 transition-colors self-start sm:self-center">
            <span className="text-[11px] font-medium leading-none">Hỗ trợ bởi AI Gemini Flash v3.5</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          </div>
        </div>

        {/* Dashboards with enter animations */}
        <AnimatePresence mode="wait">
          {currentRole === "student" && (
            <motion.div
              key="student-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <StudentDashboard />
            </motion.div>
          )}

          {currentRole === "teacher" && (
            <motion.div
              key="teacher-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <TeacherDashboard />
            </motion.div>
          )}

          {currentRole === "admin" && (
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AdminDashboard />
            </motion.div>
          )}

          {currentRole === "developer" && (
            <motion.div
              key="dev-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <DevDashboard />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Persistent Footer */}
      <footer className="glass border-t border-white/40 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="text-xs text-gray-500 font-sans">
            © 2026 <strong>LMS Next.js – Learning Management System</strong>. Thiết kế bởi Google AI Studio Build. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-3 text-[10px] text-gray-400 font-mono uppercase tracking-widest font-semibold">
            <span>Durable Store</span>
            <span>•</span>
            <span>Client Server Proxy</span>
            <span>•</span>
            <span>RBAC Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
