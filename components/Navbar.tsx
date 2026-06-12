"use client";

import React, { useState } from "react";
import { useLms } from "@/providers/LmsProviders";
import {
  BookOpen,
  Bell,
  Sparkles,
  RefreshCw,
  User,
  CheckCircle,
  Database,
  Code
} from "lucide-react";

export default function Navbar() {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    notifications,
    markNotificationRead,
    resetAllDb
  } = useLms();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/30 glass backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Logo Section */}
        <div 
          onClick={() => setCurrentRole("student")}
          className="flex cursor-pointer items-center space-x-2.5"
          id="navbar_logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
            <BookOpen className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-tight text-gray-900 leading-none">
              LMS Next.js
            </h1>
            <span className="font-mono text-[9px] font-semibold text-blue-600 uppercase tracking-wider block mt-0.5">
              Intellectual System
            </span>
          </div>
        </div>

        {/* Desktop View Switcher & Action buttons */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-500/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/20">
          <button
            onClick={() => setCurrentRole("student")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === "student"
                ? "bg-white/80 text-blue-600 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
            id="role_student_btn"
          >
            🧑‍🎓 Học Sinh
          </button>
          <button
            onClick={() => setCurrentRole("teacher")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === "teacher"
                ? "bg-white/80 text-blue-600 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
            id="role_teacher_btn"
          >
            👩‍🏫 Giáo Viên
          </button>
          <button
            onClick={() => setCurrentRole("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === "admin"
                ? "bg-white/80 text-blue-600 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
            id="role_admin_btn"
          >
            🛡️ Admin
          </button>
          <span className="h-4 w-[1px] bg-gray-200 mx-1"></span>
          <button
            onClick={() => setCurrentRole("developer")}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === "developer"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
            id="role_dev_btn"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Tài Liệu Yêu Cầu (Docs)</span>
          </button>
        </div>

        {/* Right Interactions */}
        <div className="flex items-center space-x-3">
          
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              id="bell_btn"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Card */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-2xl glass p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                id="notifications_panel"
              >
                <div className="flex items-center justify-between border-b border-gray-50 pb-2 mb-2">
                  <h3 className="font-semibold text-xs text-gray-900">Thông báo ({unreadCount})</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-gray-400 hover:text-gray-900"
                  >
                    Đóng
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-[11px] text-center text-gray-400 py-4">Không có thông báo mới</p>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                        }}
                        className={`p-2 rounded-xl text-[11px] cursor-pointer transition-colors ${notif.read ? 'glass hover:bg-white/40 text-gray-500' : 'bg-blue-500/20 hover:bg-blue-500/30 text-gray-900 border border-blue-400/30'}`}
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-semibold">{notif.title}</span>
                          <span className="font-mono text-[9px] text-gray-400">{notif.time}</span>
                        </div>
                        <p>{notif.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Simulated DB Database (Great for QA) */}
          <button
            onClick={() => {
              if (confirm("Reset lại dữ liệu về trạng thái mẫu ban đầu?")) {
                resetAllDb();
                alert("Đã reset cơ sở dữ liệu mẫu thành công!");
                window.location.reload();
              }
            }}
            title="Reset Database Simulation"
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
            id="reset_db_btn"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>

          {/* Connected User Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-150">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-gray-900 leading-none">{currentUser.name}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide leading-none ${
                  currentRole === "student" ? "bg-green-100 text-green-700" :
                  currentRole === "teacher" ? "bg-amber-100 text-amber-700" :
                  currentRole === "admin" ? "bg-purple-100 text-purple-700" :
                  "bg-blue-600 text-white"
                }`}>
                  {currentRole === "student" && "Học Viên"}
                  {currentRole === "teacher" && "Giảng Viên"}
                  {currentRole === "admin" && "Quản Trị"}
                  {currentRole === "developer" && "Kỹ Sư"}
                </span>
                <span className="text-[10px] text-gray-400 truncate max-w-[100px]">{currentUser.email}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Selector strip */}
      <div className="flex lg:hidden justify-around items-center bg-gray-50 border-t border-gray-100 px-3 py-1">
        <button
          onClick={() => setCurrentRole("student")}
          className={`px-3 py-1 rounded text-xs font-semibold ${currentRole === "student" ? "text-blue-600 bg-white shadow-xs" : "text-gray-500"}`}
        >
          🧑‍🎓 Học Viên
        </button>
        <button
          onClick={() => setCurrentRole("teacher")}
          className={`px-3 py-1 rounded text-xs font-semibold ${currentRole === "teacher" ? "text-blue-600 bg-white shadow-xs" : "text-gray-500"}`}
        >
          👩‍🏫 Giáo Viên
        </button>
        <button
          onClick={() => setCurrentRole("admin")}
          className={`px-3 py-1 rounded text-xs font-semibold ${currentRole === "admin" ? "text-blue-600 bg-white shadow-xs" : "text-gray-500"}`}
        >
          🛡️ Admin
        </button>
        <button
          onClick={() => setCurrentRole("developer")}
          className={`px-2 py-1 rounded text-xs font-semibold ${currentRole === "developer" ? "text-white bg-blue-600" : "text-gray-500"}`}
        >
          <Code className="w-3.5 h-3.5 inline mr-1" />
          Yêu cầu
        </button>
      </div>

    </header>
  );
}
