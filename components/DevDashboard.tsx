"use client";

import React, { useState } from "react";
import {
  Code,
  Database,
  GitFork,
  BookOpenCheck,
  Server,
  CloudLightning,
  Lock,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { motion } from "motion/react";

export default function DevDashboard() {
  const [activeSpec, setActiveSpec] = useState<"prisma" | "architecture" | "api" | "deployment">("prisma");

  return (
    <div className="py-6 space-y-6 text-left" id="dev_specs_workspace">
      
      {/* Title block */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-2.5 py-1 rounded bg-blue-500/15 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            Section 14: Yêu Cầu Đầu Ra (System Deliverables)
          </span>
          <h2 className="text-2xl font-black font-sans leading-tight">Sổ Điển Hình Thiết Kế Kiến Trúc & Cấu Trúc Cơ Sở Dữ Liệu</h2>
          <p className="mt-2 text-xs text-slate-300 font-light leading-relaxed">
            Tài liệu kỹ thuật tổng quan chứa đựng toàn bộ Use Case, Sơ đồ quan hệ thực thể (ERD), cấu trúc bảng PostgreSQL Schema, Prisma models, kiến trúc bảo mật RBAC, sơ đồ triển khai sản xuất Vercel, Cloudflare R2 và OpenAI.
          </p>
        </div>
        <div className="absolute top-0 right-0 h-40 w-40 translate-x-12 -translate-y-12 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Specification Selector Tabs list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 glass-dark p-1 rounded-2xl border border-white/20">
        <button
          onClick={() => setActiveSpec("prisma")}
          className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSpec === "prisma" ? "bg-white/80 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Prisma & SQL Schemas</span>
        </button>
        <button
          onClick={() => setActiveSpec("architecture")}
          className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSpec === "architecture" ? "bg-white/80 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Sơ đồ ERD & Lớp Học</span>
        </button>
        <button
          onClick={() => setActiveSpec("api")}
          className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSpec === "api" ? "bg-white/80 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Server className="w-4 h-4" />
          <span>REST APIs & Storage</span>
        </button>
        <button
          onClick={() => setActiveSpec("deployment")}
          className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSpec === "deployment" ? "bg-white/80 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <CloudLightning className="w-4 h-4" />
          <span>Triển khai & Bảo mật</span>
        </button>
      </div>

      {/* Main Specifications view area */}
      <div className="glass rounded-3xl p-6 min-h-[400px]">
        {activeSpec === "prisma" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2">1. Prisma ORM Schema Model Definitions</h3>
              <p className="text-xs text-gray-500 mt-1">Cấu trúc thực thể đồng bộ hoá trực tiếp với PostgreSQL cloud database</p>
              
              <div className="bg-slate-950 rounded-2xl p-4 mt-3 max-h-[400px] overflow-y-auto">
                <pre className="text-[10px] text-green-400 font-mono leading-relaxed select-text whitespace-pre">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  TEACHER
  ADMIN
}

model User {
  id          String        @id @default(uuid())
  name        String
  email       String        @unique
  role        Role          @default(STUDENT)
  avatar      String?
  createdAt   DateTime      @default(now())
  status      String        @default("Active")
  enrollments Enrollment[]
  courses     Course[]      // Created by teachers
  comments    Comment[]
}

model Course {
  id          String        @id @default(uuid())
  title       String
  description String
  category    String
  level       String
  imageUrl    String?
  teacherId   String
  teacher     User          @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  lessons     Lesson[]
  quizzes     QuizQuestion[]
  enrollments Enrollment[]
}

model Lesson {
  id          String        @id @default(uuid())
  courseId    String
  course      Course        @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title       String
  duration    String
  videoUrl    String
  pdfUrl      String?
  content     String        @db.Text
}

model QuizQuestion {
  id            String      @id @default(uuid())
  courseId      String
  course        Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)
  questionText  String
  options       String[]    // Array of choices
  correctAnswer Int
  explanation   String
}

model Enrollment {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId        String
  course          Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  progress        Int       @default(0)
  lessonsCompleted String[] // Array of completion flags
  score           Int?
  completed       Boolean   @default(false)
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2">2. PostgreSQL Raw SQL DDL</h3>
              <p className="text-xs text-gray-500 mt-1">Cú pháp định nghĩa quan hệ trong PostgreSQL (Chuẩn hóa 3NF với Khóa ngoại)</p>
              
              <div className="bg-slate-950 rounded-2xl p-4 mt-3">
                <pre className="text-[10px] text-green-400 font-mono leading-relaxed select-text whitespace-pre">
{`-- Tạo Enums cho phân quyền hệ thống
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- Tạo Bảng Users
CREATE TABLE "Users" (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "role" "Role" DEFAULT 'STUDENT',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Bảng Khóa học (Foreign Key references Users.id)
CREATE TABLE "Courses" (
    "id" VARCHAR(255) PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),
    "level" VARCHAR(50),
    "teacher_id" VARCHAR(255) REFERENCES "Users"("id") ON DELETE CASCADE
);

-- Chỉ mục Index tăng tốc độ truy vấn tìm kiếm khóa học
CREATE INDEX "idx_courses_category" ON "Courses"("category");`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeSpec === "architecture" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2 mb-4">Sơ đồ quan hệ thực thể (ERD & Architecture Diagram)</h3>
              
              {/* Illustrated relational flowchart mapping out relational tables */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Entity block 1 */}
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
                      <strong className="text-blue-900">👩‍🎓 Users (Bảng chính)</strong>
                      <span className="text-[9px] font-mono text-blue-500">1-N</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-600 font-light">
                      <li>• <strong className="font-mono text-blue-900 font-medium">id</strong> (Primary Key)</li>
                      <li>• email (Unique)</li>
                      <li>• role (ENUM STUDENT/TEACHER/ADMIN)</li>
                      <li>• status (Active/Inactive)</li>
                    </ul>
                  </div>

                  {/* Entity block 2 */}
                  <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/20 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
                      <strong className="text-purple-900">📚 Courses</strong>
                      <span className="text-[9px] font-mono text-purple-500">1-N / Foreign key</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-600 font-light">
                      <li>• <strong className="font-mono text-purple-900 font-medium">id</strong> (Primary Key)</li>
                      <li>• teacherId → <em className="text-gray-400">FK Users.id</em></li>
                      <li>• title, category, level</li>
                    </ul>
                  </div>

                  {/* Entity block 3 */}
                  <div className="p-4 rounded-xl border border-green-150 bg-green-50/20 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-green-150 pb-1.5">
                      <strong className="text-green-900">✏️ Lessons & Quizzes</strong>
                      <span className="text-[9px] font-mono text-green-600">N-1 references Course</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-600 font-light">
                      <li>• <strong className="font-mono text-green-900 font-medium">id</strong> (Primary Key)</li>
                      <li>• courseId → <em className="text-gray-400">FK Courses.id</em></li>
                      <li>• duration, content (Markdown)</li>
                      <li>• questionText, correctAnswer</li>
                    </ul>
                  </div>

                </div>

                {/* Relational arrow layouts */}
                <div className="p-4 rounded-xl border border-gray-150 bg-gray-50 flex flex-col md:flex-row items-center justify-around gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-gray-800">Users</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <span>Đăng ký học (Enrollments)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-bold text-gray-800">Courses</span>
                  </div>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-gray-800">Courses</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <span>Bài học ghép lồng (Lessons)</span>
                  </div>
                </div>

              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2 mb-3">Sơ Đồ Thực Hiện Luồng Hành Vi (Activity Flow)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light text-gray-600 text-left">
                <div className="p-3 border rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-900 block mb-1">Luồng Học Sinh (Student Activity)</span>
                  <p className="text-[11px]">Đăng nhập → Chọn Khóa học → Đăng ký (Enroll) → Xem video lý thuyết → Đọc tài liệu PDF → Làm bài kiểm tra mạt trắc → Nhận đánh giá & Lưu điểm số.</p>
                </div>
                <div className="p-3 border rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-900 block mb-1">Luồng Giáo Viên (Teacher Activity)</span>
                  <p className="text-[11px]">Đăng nhập → Soạn giáo án (Tạo khóa học) → Phân chia bài học lý thuyết → Gán tệp video/PDF → Tạo mẫu đề trắc nghiệm kiểm tra → Xem xếp hạng lớp.</p>
                </div>
                <div className="p-3 border rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-900 block mb-1">Luồng Trợ lý AI (Gemini AI Flow)</span>
                  <p className="text-[11px]">Nhận nội dung bài giảng hiện thời → Phân tích từ vựng ngữ nghĩa → Trích xuất bản tóm tắt tệp PDF tự động → Tự sinh đề thi tương thích hoặc đối thoại giải thích code.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSpec === "api" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2 mb-3">Next.js REST API Specifics</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <th className="p-3">Endpoint Endpoint</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Mô tả chức năng</th>
                      <th className="p-3">Authorization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-light">
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">/api/gemini</td>
                      <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold scale-90">POST</span></td>
                      <td className="p-3 col-span-2">Cầu kết nối đến Gemini AI. Xử lý chatbot hội thoại học thuật, sinh câu hỏi và tóm tắt.</td>
                      <td className="p-3 font-mono text-gray-400">Authenticated (Student/Teacher)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">/api/courses</td>
                      <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold scale-90">GET</span></td>
                      <td className="p-3">Truy vết lấy danh sách toàn bộ khóa học và chương trình giảng dạy.</td>
                      <td className="p-3 font-mono text-gray-400">Public Access</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">/api/courses</td>
                      <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold scale-90">POST</span></td>
                      <td className="p-3">Xuất bản các mốc kế hoạch khóa học (Tạo bài giảng mới).</td>
                      <td className="p-3 font-mono text-red-500 font-semibold">Teacher / Admin</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-semibold text-blue-600">/api/users</td>
                      <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold scale-90">PUT</span></td>
                      <td className="p-3">Cập nhật hồ sơ tài khoản bảo mật và phân quyền vai trò (Role).</td>
                      <td className="p-3 font-mono text-red-500 font-semibold">Admin Exclusive</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2 mb-3">Cài Đặt Lưu Trữ Tệp S3 / Cloudflare R2 (File Storage Setup)</h3>
              <p className="text-xs text-gray-500 mb-2">Video MP4 bài giảng, tệp tài liệu PDF giáo trình và ảnh banner được lưu trữ tại Cloudflare R2 nhằm tối đa tốc độ CDN.</p>
              
              <div className="bg-slate-950 rounded-2xl p-4">
                <pre className="text-[10px] text-green-400 font-mono leading-relaxed select-text whitespace-pre">
{`// Cấu hình S3 SDK tương thích Cloudflare R2 bucket trong Next.js route:
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: \`https://\${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeSpec === "deployment" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2 mb-3">Triển Khai Sản Xuất Lên Vercel & Neon PostgreSQL</h3>
              
              <div className="space-y-3.5 text-xs text-gray-700 leading-relaxed font-light">
                <ol className="list-decimal pl-4 space-y-2.5">
                  <li>
                    <strong>Khởi tạo cơ sở dữ liệu cloud:</strong> Đăng nhập vào Neon.tech hoặc Supabase, khởi tạo một Database PostgreSQL mới và copy chuỗi kết nối dán vào biến môi trường:
                    <code className="block mt-1 p-2 bg-gray-50 border rounded font-mono text-[9px] text-red-600">DATABASE_URL=&quot;postgresql://username:password@ep-cool-cloud.neon.tech/lms_db&quot;</code>
                  </li>
                  <li>
                    <strong>Chạy khởi sinh database schema:</strong> Thực hiện lệnh prisma migrate để đồng bộ hóa bảng:
                    <code className="block mt-1 p-2 bg-gray-50 border rounded font-mono text-[9px] text-blue-600">npx prisma db push</code>
                  </li>
                  <li>
                    <strong>Thiết lập biến môi trường trên Vercel Dashboard:</strong> Thêm các khoá bảo mật gồm:
                    <ul className="list-disc pl-5 mt-1 space-y-1 font-mono text-[10px] text-slate-600">
                      <li>• GEMINI_API_KEY (Sinh đề thi trắc nghiệm & summarize)</li>
                      <li>• AUTH_SECRET (JWT session validation)</li>
                      <li>• R2_ACCESS_KEY_ID (Upload tệp PDF)</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans border-b border-gray-100 pb-2 mb-3">Thiết Kế Bảo Mật & Xác Thực Phân Quyền (RBAC)</h3>
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 text-xs text-gray-600 space-y-2">
                <p>Hệ thống LMS được trang bị kiến trúc kiểm soát phiên truy cập theo vai trò <strong>Role-Based Access Control (RBAC)</strong>:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-[11px] font-light">
                  <li><strong>Middleware Route Protection:</strong> Ngăn chặn truy cập bất thường vào các trang giáo trình và admin thông qua tệp xác thực trung gian JWT.</li>
                  <li><strong>SQL Injection Guard:</strong> Sử dụng ORM Prisma đảm bảo toàn bộ tham số truy cập SQL đều được dán nhãn tham chiếu nghiêm ngặt.</li>
                  <li><strong>Input Validation constraints:</strong> Toàn bộ dữ liệu của biểu mẫu tạo lớp mới, đăng ký tài khoản được kiểm duyệt kỹ càng qua thư viện Zod chuẩn chỉnh trước khi lưu dọn vào SQL.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
