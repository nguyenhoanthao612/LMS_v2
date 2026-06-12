import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Fallback high-quality responses for the LMS when the AI key is not yet set
const FALLBACK_QUIZZES = [
  {
    questionText: "What is the primary role of the virtual DOM in modern frameworks?",
    options: [
      "To directly speed up server response times",
      "To minimize raw DOM manipulations by batching changes",
      "To translate HTML content to binary execution files",
      "To act as a persistent security firewall on the client side"
    ],
    correctAnswer: 1,
    explanation: "The Virtual DOM keeps a lightweight representation of the UI in memory and syncs with the real DOM, optimizing render performance by minimizing heavy layout recalculations."
  },
  {
    questionText: "Which of the following describes Next.js Server Components?",
    options: [
      "They run entirely on the client after initial hydration",
      "They can use standard React hooks like useState directly and render on screen",
      "They execute purely on the server, sending pre-rendered HTML to the client",
      "They are only used to configure package script runners"
    ],
    correctAnswer: 2,
    explanation: "Server Components are executed and rendered on the server, which improves load performance by keeping client bundles small."
  },
  {
    questionText: "What does the 'use client' directive indicate in Next.js App Router?",
    options: [
      "The entire module must be parsed and processed on server database instances only",
      "It marks the boundary to include this component and its imports in the client-side bundle",
      "It disables CSS styles completely for this component",
      "It overrides custom API keys for security scanning"
    ],
    correctAnswer: 1,
    explanation: "'use client' is used to declare a boundary where React Hook usage, event handlers, or browser-only APIs are supported."
  }
];

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      // Return beautiful fallback intelligence if API Key is not set yet
      if (action === "chat") {
        const userMsg = payload?.message || "";
        let botReply = "I am your AI Study Companion! I was able to analyze your learning materials. Please add an API key in the Setup Secrets section for fully live AI, but in the meantime: Let's focus on mastering the concepts of modern web development and software architecture!";
        if (userMsg.toLowerCase().includes("typescript") || userMsg.toLowerCase().includes("type")) {
          botReply = "TypeScript adds static typing to JavaScript. It catches potential errors at compile time before your code runs in production. For instance, using interfaces and generics ensures database payloads precisely match your view states!";
        } else if (userMsg.toLowerCase().includes("next") || userMsg.toLowerCase().includes("routing")) {
          botReply = "Next.js 15 uses the App Router where directories define routes. The server-first architecture loads data on the server, decreasing the time-to-first-paint and enhancing SEO out of the box.";
        } else if (userMsg.toLowerCase().includes("quiz") || userMsg.toLowerCase().includes("test")) {
          botReply = "Evaluating yourself with mock questions is highly proven to double information persistence. Try starting a course quiz from the syllabus index!";
        }
        return NextResponse.json({ success: true, text: botReply, source: "mock-engine" });
      }

      if (action === "summarize") {
        const materialContent = payload?.content || "No content provided.";
        const summary = `### 📝 Tóm tắt bài học tự động (AI Suggested Summary)\n\n• **Khái niệm cốt lõi:** Lesson focuses on structural architecture and professional standards.\n• **Các điểm then chốt (Key Takeaways):**\n  1. Hiểu rõ luồng dữ liệu (Data-flow) giữa client và server side.\n  2. Tối ưu hóa hiệu năng render bằng cách giảm chi phí cập nhật giao diện.\n  3. Đảm bảo tính an toàn dữ liệu và phân quyền người dùng có cấu trúc.\n\n*Gợi ý ôn tập: Xem lại các ví dụ thực hành và thử trả lời các câu hỏi trong mục Bài tập kiểm tra.*`;
        return NextResponse.json({ success: true, text: summary, source: "mock-engine" });
      }

      if (action === "generate_quiz") {
        return NextResponse.json({ success: true, quizzes: FALLBACK_QUIZZES, source: "mock-engine" });
      }

      return NextResponse.json({ success: false, error: "Unknown action" });
    }

    // Initialize modern @google/genai client
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    if (action === "chat") {
      const chatHistory = payload?.history || []; // contains { role: 'user' | 'model', text: string }
      const currentMessage = payload?.message || "";
      const courseTitle = payload?.courseTitle || "General Studies";
      const lessonTitle = payload?.lessonTitle || "Overview";

      const systemInstruction = `You are a dynamic, highly supportive and professional AI Study Companion in a modern Learning Management System (LMS) called 'LMS Next.js'.
The student is studying the course "${courseTitle}", current lesson: "${lessonTitle}".
Provide clear, expert, and encouraging answers to the user's questions in markdown form. Avoid code typos. Keep explanations straightforward, helpful, and written preferably in Vietnamese (as requested by PRD settings) or transition smoothly if the user asks in English.`;

      // Structure contents for generateContent
      const contents = [];
      for (const turn of chatHistory) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: currentMessage }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return NextResponse.json({
        success: true,
        text: response.text || "No response text was generated.",
        source: "gemini-3.5-flash"
      });
    }

    if (action === "summarize") {
      const title = payload?.title || "Lesson";
      const content = payload?.content || "No lesson content.";

      const prompt = `Xem xét nội dung tài liệu học tập sau đây về bài học "${title}" và viết một bài tóm tắt ngắn gọn, trực quan và chuyên nghiệp bằng tiếng Việt bằng định dạng Markdown.
Chia tóm tắt thành các phần rõ ràng như: Khái niệm chính, Các điểm cốt lõi cần nhớ (dạng danh sách), và Gợi ý câu hỏi ôn tập.

Nội dung:
${content}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert curriculum designer and educator who summarises raw documents into pristine learning summary sheets.",
          temperature: 0.5,
        }
      });

      return NextResponse.json({
        success: true,
        text: response.text || "Failed to generate summary.",
        source: "gemini-3.5-flash"
      });
    }

    if (action === "generate_quiz") {
      const title = payload?.title || "Course Material";
      const content = payload?.content || "General knowledge.";

      const prompt = `Dựa trên nội dung học tập sau đây cho bài "${title}", hãy tạo chính xác 3 câu hỏi trắc nghiệm có chất lượng cao để kiểm tra kiến thức của học viên.
Hãy cung cấp kết quả ở định dạng JSON thô dạng mảng, trong đó mỗi phần tử có đúng định dạng:
[
  {
    "questionText": "Câu hỏi trắc nghiệm tiếng Việt?",
    "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
    "correctAnswer": 0, // Chỉ số 0-3 của đáp án đúng
    "explanation": "Lời giải thích chi tiết tại sao đáp án lại đúng..."
  }
]

Nội dung bài học:
${content}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional educational examiner. Output JSON only, matching the exact requested JSON array schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["questionText", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const responseText = response.text || "[]";
      const quizzes = JSON.parse(responseText);

      return NextResponse.json({
        success: true,
        quizzes: quizzes,
        source: "gemini-3.5-flash"
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action parameter" });

  } catch (error: any) {
    console.error("Gemini API handler error:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Internal Server Error",
      quizzes: FALLBACK_QUIZZES // Provide robust fallbacks on error conditions
    }, { status: 200 });
  }
}
