"use client";

import React, { useState } from "react";
import { useLms } from "@/providers/LmsProviders";
import { User } from "@/lib/db-seed";
import {
  Users,
  ShieldAlert,
  Server,
  FolderPlus,
  Trash2,
  Plus,
  Loader,
  X,
  Play,
  TrendingUp,
  BarChart2,
  Activity,
  Award
} from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboard() {
  const {
    users,
    courses,
    categories,
    enrollments,
    discussions,
    addUser,
    deleteUser,
    updateUser,
    addCategory
  } = useLms();

  // Dialog overlay states
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // User input fields
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<"student" | "teacher" | "admin">("student");

  // Category inputs
  const [catName, setCatName] = useState("");

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    addUser({
      name: userName.trim(),
      email: userEmail.trim(),
      role: userRole,
      avatar: `https://picsum.photos/seed/${userName.length}/100/100`,
      dateCreated: new Date().toISOString().substring(0, 10),
      status: "Active"
    });

    // Reset
    setUserName("");
    setUserEmail("");
    setUserRole("student");
    setShowAddUser(false);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser);
    setEditingUser(null);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addCategory(catName.trim());
    setCatName("");
  };

  const toggleUserStatus = (u: User) => {
    const updated = {
      ...u,
      status: u.status === "Active" ? ("Inactive" as const) : ("Active" as const)
    };
    updateUser(updated);
  };

  // Static mock logs for the audit viewer
  const ADMIN_AUDIT_LOGS = [
    { id: "log-1", service: "AUTH", event: "Standard Student session signed on from IPv4", time: "10 giây trước" },
    { id: "log-2", service: "GEMINI_API", event: "Completed 3.5-flash text-summarization request", time: "5 phút trước" },
    { id: "log-3", service: "DATABASE", event: "Prisma schema metadata sync complete on Supabase", time: "1 giờ trước" },
    { id: "log-4", service: "SYSTEM", event: "Local state sync accomplished successfully", time: "2 giờ trước" },
  ];

  return (
    <div className="py-6 space-y-8 text-left" id="admin_workspace">
      
      {/* 1. Global KPIs Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Tài Khoản Toàn Hệ Thống</span>
            <h4 className="text-xl font-bold text-gray-900 mt-1 font-sans">{users.length} Người dùng</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Khóa Học Đã Xuất Bản</span>
            <h4 className="text-xl font-bold text-gray-900 mt-1 font-sans">{courses.length} Lớp</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Danh Mục Chuyên Khoa</span>
            <h4 className="text-xl font-bold text-gray-900 mt-1 font-sans">{categories.length} Nhóm</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <FolderPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Bình luận trao đổi</span>
            <h4 className="text-xl font-bold text-gray-900 mt-1 font-sans">{discussions.length} Tin</h4>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 2. Custom High Fidelity SVG Analytics Charts (Avoid Hydration errors, beautiful & fast) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CHART 1: Sign up volume represented as animated SVG columns bar chart */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider font-sans">Lượng Đăng Ký Khóa Học (Tuần này)</h4>
              <p className="text-[10px] text-gray-400">Phân tích học viên tham gia mới theo từng ngày</p>
            </div>
            <BarChart2 className="w-4 h-4 text-blue-600" />
          </div>

          {/* SVG Bar Chart */}
          <div className="relative h-44 w-full flex items-end justify-between px-2 pt-6">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-gray-300 font-mono">
              <span className="border-b border-gray-50 pb-0.5">80 Đăng ký</span>
              <span className="border-b border-gray-50 pb-0.5">40 Đăng ký</span>
              <span className="border-b border-gray-50 pb-0.5">0 Đăng ký</span>
            </div>

            {/* Daily stats columns */}
            {[
              { day: "T2", val: 30, height: "37.5%" },
              { day: "T3", val: 55, height: "68.75%" },
              { day: "T4", val: 40, height: "50%" },
              { day: "T5", val: 75, height: "93.75%" },
              { day: "T6", val: 60, height: "75%" },
              { day: "T7", val: 80, height: "100%" },
              { day: "CN", val: 45, height: "56.25%" },
            ].map((col, idx) => (
              <div key={idx} className="relative group flex flex-col items-center flex-1 z-10 px-1">
                {/* Tooltip */}
                <div className="absolute -top-7 scale-0 group-hover:scale-100 px-2 py-0.5 bg-blue-900 text-white text-[9px] font-bold rounded-md transition-all">
                  {col.val} Học viên
                </div>
                {/* Visual block bar */}
                <div 
                  style={{ height: col.height }} 
                  className="w-4.5 bg-linear-to-t from-blue-700 to-indigo-600 rounded-t-sm group-hover:from-blue-600 group-hover:to-indigo-500 transition-all shadow-xs"
                ></div>
                <span className="mt-2 text-[10px] text-gray-500 font-medium">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: Active Users Spline Line Chart represented as premium SVG */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider font-sans">Mức Độ Tương Tác Học Viên (Active Session)</h4>
              <p className="text-[10px] text-gray-400">Đếm số lượng học viên tương tác trực tuyến theo giờ</p>
            </div>
            <Activity className="w-4 h-4 text-green-600" />
          </div>

          {/* SVG Spline Area Graphic */}
          <div className="relative h-44 w-full">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-gray-300 font-mono">
              <span className="border-b border-gray-50 pb-0.5">200 Users</span>
              <span className="border-b border-gray-50 pb-0.5">100 Users</span>
              <span className="border-b border-gray-50 pb-0.5">0 Users</span>
            </div>

            {/* Spline line graphic inside an canvas */}
            <svg className="absolute inset-0 h-full w-full z-10" viewBox="0 0 400 150" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 130 Q 50 80 100 100 T 200 40 T 300 70 T 400 30"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 130 Q 50 80 100 100 T 200 40 T 300 70 T 400 30 L 400 150 L 0 150 Z"
                fill="url(#chartGrad)"
              />
            </svg>

            {/* Time stamps markers */}
            <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 text-[10px] text-gray-400">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Global settings panels: Users, Categories directory and System audit logs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* A. User management partition list (2/3 size) */}
        <div className="xl:col-span-2 glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider font-sans">Hồ Sơ Sổ Đăng Ký Người Dùng ({users.length})</h4>
            <button
              onClick={() => setShowAddUser(true)}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-xs inline-flex items-center space-x-1"
              id="admin_add_user_trigger"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thành Viên Mới</span>
            </button>
          </div>

          {/* User grid directory */}
          <div className="divide-y divide-gray-50 max-h-[350px] overflow-y-auto pr-1">
            {users.map((u) => (
              <div key={u.id} className="flex justify-between items-center py-3 text-xs">
                <div className="flex items-center space-x-3 text-left">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <h5 className="font-semibold text-gray-900">{u.name}</h5>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 ml-2">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide font-mono ${
                    u.role === "student" ? "bg-green-100 text-green-700" :
                    u.role === "teacher" ? "bg-amber-100 text-amber-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>
                    {u.role}
                  </span>

                  <button
                    onClick={() => toggleUserStatus(u)}
                    className={`px-2 py-0.5 border rounded text-[9px] font-bold transition-all ${
                      u.status === "Active"
                        ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                        : "border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {u.status}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Bạn chắc chắn muốn xóa tài khoản '${u.name}'?`)) {
                        deleteUser(u.id);
                      }
                    }}
                    className="p-1 hover:text-red-500 hover:bg-red-50 rounded"
                    title="Xóa tài khoản"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B. Category setup and systemic log teleconference (1/3 size) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Category Adding Widget */}
          <div className="glass p-5 rounded-2xl space-y-3.5">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider font-sans">Thư mục môn khoa ({categories.length})</h4>
            
            <form onSubmit={handleAddCategorySubmit} className="flex gap-1.5">
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Tên môn mới (e.g. Android)..."
                className="flex-1 px-2.5 py-1.5 rounded-lg text-xs glass-input"
              />
              <button
                type="submit"
                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Thêm
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-medium"
                >
                  {cat.name} ({cat.courseCount})
                </span>
              ))}
            </div>
          </div>

          {/* System logs widget */}
          <div className="glass p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider font-sans">Nhật ký hệ thống (Audit Logs)</h4>
            
            <div className="space-y-1.5 pr-1 max-h-52 overflow-y-auto">
              {ADMIN_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="p-2 border border-gray-50/50 bg-gray-50/20 rounded-lg text-[10px] leading-tight space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold font-mono text-blue-600">{log.service}</span>
                    <span className="text-[9px] text-gray-400">{log.time}</span>
                  </div>
                  <p className="text-gray-600 font-sans text-left">{log.event}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* C. Popup Form: Add user credential */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-[24px] glass p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddUser(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-bold text-sm text-gray-900 mb-4 font-sans">Tạo hồ sơ thành viên mới</h4>
            
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">Họ và Tên</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Lê văn Tám"
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">Email liên lạc</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. letam@gmail.com"
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">Vai trò phân nhiệm</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                >
                  <option value="student">Student (Học viên)</option>
                  <option value="teacher">Teacher (Giảng viên)</option>
                  <option value="admin">Admin (Quản trị viên)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-100 transition-colors mt-2"
                id="submit_new_user_frm"
              >
                Cấp quyền & Lưu trữ 👤
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
