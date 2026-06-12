export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  pdfUrl?: string;
  content: string;
  isComplete?: boolean;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  imageUrl: string;
  lessons: Lesson[];
  quizzes: QuizQuestion[];
  teacherId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar: string;
  dateCreated: string;
  status: "Active" | "Inactive";
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0 to 100
  lessonsCompleted: string[]; // lessonIds
  completed: boolean;
  score?: number;
}

export interface DiscussionMessage {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  courseCount: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: "frontend", name: "Frontend Development", courseCount: 2 },
  { id: "backend", name: "Backend Development", courseCount: 1 },
  { id: "fullstack", name: "Next.js & Fullstack Frameworks", courseCount: 2 },
  { id: "database", name: "Databases & ORM", courseCount: 1 },
];

export const INITIAL_USERS: User[] = [
  {
    id: "user-1",
    name: "Nguyễn Hoài Nam",
    email: "hoainam@gmail.com",
    role: "student",
    avatar: "https://picsum.photos/seed/nam/100/100",
    dateCreated: "2026-01-15",
    status: "Active",
  },
  {
    id: "user-2",
    name: "Trần Minh Quân",
    email: "minhquan@gmail.com",
    role: "teacher",
    avatar: "https://picsum.photos/seed/quan/100/100",
    dateCreated: "2025-11-20",
    status: "Active",
  },
  {
    id: "user-3",
    name: "Admin System",
    email: "admin@lms-next.js",
    role: "admin",
    avatar: "https://picsum.photos/seed/admin/100/100",
    dateCreated: "2025-09-01",
    status: "Active",
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Khóa học mới xuất bản",
    description: "Khóa học 'Next.js App Router Masterclass v15+' vừa được thêm vào hệ thống.",
    time: "10 phút trước",
    read: false,
    type: "success",
  },
  {
    id: "notif-2",
    title: "Bài kiểm tra đã được chấm",
    description: "Giảng viên Trần Minh Quân đã chấm điểm bài tập TypeScript Essentials của bạn.",
    time: "2 giờ trước",
    read: false,
    type: "info",
  },
  {
    id: "notif-3",
    title: "Có thông báo bảo trì hệ thống",
    description: "Hệ thống sẽ bảo trì định kỳ vào 01:00 AM Chủ Nhật tuần này.",
    time: "1 ngày trước",
    read: true,
    type: "warning",
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    title: "TypeScript Essentials for Modern Web Developers",
    description: "Làm chủ TypeScript từ cơ bản đến nâng cao: Type Guards, Generics, mapped types, decorators, và tích hợp sâu với các thư viện frontend hàng đầu.",
    category: "frontend",
    level: "Intermediate",
    imageUrl: "https://picsum.photos/seed/typescript/600/400",
    teacherId: "user-2",
    lessons: [
      {
        id: "c1-l1",
        title: "1. Sự cần thiết của Static Typing & Cài đặt môi trường",
        duration: "12:45",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        content: `### Sự cần thiết của Static Typing

JavaScript ban đầu được thiết kế là một ngôn ngữ kịch bản gọn nhẹ. Sự phát triển mạnh mẽ của các ứng dụng web phức tạp đặt ra yêu cầu mới về kiểm soát lỗi.

#### 1. TypeScript giải quyết vấn đề gì?
- **Phát hiện lỗi sớm:** Lỗi sai kiểu biến, thiếu thuộc tính object được phát hiện trực tiếp khi coding thay vì lúc runtime.
- **Tự động gợi ý (Autocomplete):** Editor hiểu rõ cấu trúc của object giúp lập trình nhanh hơn, ít sai sót hơn.
- **Dễ dàng cấu trúc lại (Refactoring):** Đổi tên biến, hàm trên quy mô lớn sẽ tự động kiểm tra và báo lỗi ở mọi file liên quan.

#### 2. Cài đặt cơ bản:
Để biên dịch file TypeScript thành JavaScript, chúng ta cài đặt thông qua npm:
\`\`\`bash
npm install -g typescript
tsc --init
\`\`\`
Lệnh trên khởi tạo file \`tsconfig.json\` chứa toàn bộ cấu hình biên dịch của dự án.`
      },
      {
        id: "c1-l2",
        title: "2. Làm chủ Generics và Type Constraints",
        duration: "18:20",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        content: `### Generics trong TypeScript

Generics cho phép lập trình viên tạo ra các khối mã (hàm, interface, class) có khả năng tái sử dụng cao với nhiều kiểu dữ liệu khác nhau, trong khi vẫn bảo toàn tính an toàn kiểu dữ liệu.

#### 1. Ví dụ cơ bản:
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
\`\`\`

#### 2. Type Constraints (Rút gọn điều kiện)
Nếu muốn Generic chỉ nhận các kiểu dữ liệu kế thừa từ một cấu trúc nhất định, ta dùng từ khoá \`extends\`:
\`\`\`typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Không có lỗi vì T bắt buộc phải có thuộc tính length
  return arg;
}
\`\`\`
Generics là xương sống cho các framework hiện đại khi làm việc với API response và Drizzle ORM.`
      },
      {
        id: "c1-l3",
        title: "3. Advanced Types: Utility Types & Mapped Types",
        duration: "15:10",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        content: `### Advanced Types trong TypeScript

Buổi học này đi sâu vào các kỹ thuật nâng cao để biến đổi và tạo ra các kiểu dữ liệu linh hoạt.

#### 1. Mapped Types
Mapped Types cho phép tạo kiểu dữ liệu mới bằng cách duyệt qua tất cả các khoá của kiểu dữ liệu cũ:
\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

#### 2. Thư viện Utility Types hỗ trợ sẵn:
- \`Partial<T>\`: Biến tất cả thuộc tính của T thành optional.
- \`Required<T>\`: Biến tất cả thuộc tính thành bắt buộc.
- \`Pick<T, K>\`: Chọn lọc một số thuộc tính K nhất định từ T.
- \`Omit<T, K>\`: Loại bỏ các thuộc tính K ra khỏi T.`
      }
    ],
    quizzes: [
      {
        id: "c1-q1",
        questionText: "Lợi ích lớn nhất của việc sử dụng Generics là gì?",
        options: [
          "Giúp mã biên dịch chạy nhanh hơn gấp 10 lần lúc runtime",
          "Tái sử dụng mã nguồn an toàn kiểu dữ liệu cho nhiều kiểu biến khác nhau",
          "Cho phép lập trình viên bỏ hoàn toàn việc viết CSS",
          "Để biên dịch TypeScript trực tiếp thành cấu trúc SQL"
        ],
        correctAnswer: 1,
        explanation: "Generics cho phép định nghĩa mã nguồn hoạt động trên nhiều kiểu dữ liệu mà vẫn duy trì kiểm soát kiểu chặt chẽ từ compiler."
      },
      {
        id: "c1-q2",
        questionText: "Từ khóa nào được sử dụng để giới hạn kiểu dữ liệu của một Generics?",
        options: [
          "implements",
          "extends",
          "typeof",
          "constrain"
        ],
        correctAnswer: 1,
        explanation: "Từ khóa 'extends' được dùng trong Generics để ép buộc tham số kiểu kế thừa một cấu trúc hoặc thuộc tính chỉ định trước (Type Constraints)."
      }
    ]
  },
  {
    id: "course-2",
    title: "Next.js 15 App Router Masterclass v15.4+",
    description: "Học sâu về Next.js tiên tiến nhất: Server vs Client Components, Data Fetching & Caching Strategies, Server Actions, Middleware, Dynamic Route, và phân tích hiệu suất tối đa.",
    category: "fullstack",
    level: "Advanced",
    imageUrl: "https://picsum.photos/seed/nextjs/600/400",
    teacherId: "user-2",
    lessons: [
      {
        id: "c2-l1",
        title: "1. Kiến trúc React Server Components (RSC) & Client Components",
        duration: "20:15",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        content: `### React Server Components (RSC) trong Next.js 15

Next.js 15 lấy Server Components làm kiến trúc mặc định. Mọi thành phần mã nguồn trong thư mục \`app/\` đều render trên máy chủ trước khi được truyền về.

#### 1. Sự khác biệt cốt lõi:
- **Server Components:**
  - Render trực tiếp trên Server.
  - Không tải JavaScript của component xuống client (giảm kích thước bundle).
  - Có thể gọi trực tiếp database, hệ thống file, hoặc API Key riêng tư một cách an toàn.
  - Không hỗ trợ React Hooks (\`useState\`, \`useEffect\`).
- **Client Components (\`'use client'\`):**
  - Chạy trên client thông qua tiến trình hydration.
  - Hỗ trợ đầy đủ tương tác tương thích trình duyệt và các hook.

#### 2. Quy tắc lồng nhau:
Bạn có thể truyền các Server Components như con (\`children\`) của Client Components để bảo toàn kiến trúc render máy chủ.`
      },
      {
        id: "c2-l2",
        title: "2. Kỹ thuật Data Fetching, Caching và Revalidation",
        duration: "16:40",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        content: `### Data Fetching trong Next.js 15

Next.js 15 mở rộng API \`fetch\` mặc định của Web để cung cấp hệ thống lưu trữ đệm (Caching) và tái xác thực (Revalidation) mạnh mẽ.

#### 1. Các chế độ Fetching:
- **Force Cache (Static):**
  \`\`\`typescript
  fetch('https://api.example.com/data', { cache: 'force-cache' })
  \`\`\`
  Lưu trữ dữ liệu mãi mãi cho đến khi nhận tín hiệu revalidate.
- **No Store (Dynamic):**
  \`\`\`typescript
  fetch('https://api.example.com/data', { cache: 'no-store' })
  \`\`\`
  Luôn lấy dữ liệu mới nhất ở mọi lượt yêu cầu của client.
- **Time-based Revalidation (ISR):**
  \`\`\`typescript
  fetch('https://api.example.com/data', { next: { revalidate: 3600 } })
  \`\`\`
  Làm mới dữ liệu sau mỗi 60 phút.`
      }
    ],
    quizzes: [
      {
        id: "c2-q1",
        questionText: "Thành phần nào sau đây chạy mặc định trên Server trong Next.js 15?",
        options: [
          "Mọi component trong thư mục app/ ngoại trừ những file khai báo 'use client'",
          "Component có chứa useState và useEffect",
          "Tất cả file CSS và SVG tại client assets",
          "Chỉ có các API Route handlers mới chạy trên Server"
        ],
        correctAnswer: 0,
        explanation: "Next.js App Router xem tất cả component là Server Components trừ khi bạn dán từ khoá 'use client' ở đầu tệp."
      }
    ]
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: "enroll-1",
    userId: "user-1",
    courseId: "course-1",
    progress: 33,
    lessonsCompleted: ["c1-l1"],
    completed: false,
    score: 80,
  }
];

export const INITIAL_DISCUSSIONS: DiscussionMessage[] = [
  {
    id: "disc-1",
    courseId: "course-1",
    userId: "user-1",
    userName: "Nguyễn Hoài Nam",
    userRole: "student",
    text: "Mình gặp lỗi biên dịch 'Cannot find namespace' ở bài 2, ai xử lý được không ạ?",
    timestamp: "2026-06-12 09:30"
  },
  {
    id: "disc-2",
    courseId: "course-1",
    userId: "user-2",
    userName: "Trần Minh Quân",
    userRole: "teacher",
    text: "Bạn Nam hãy kiểm tra xem đã chỉnh sủa 'tsconfig.json' khớp với hướng dẫn chưa nhé, nhớ khởi tạo tsc --init.",
    timestamp: "2026-06-12 10:15"
  }
];
