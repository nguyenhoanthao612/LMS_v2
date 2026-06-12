import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles
import { LmsProvider } from '@/providers/LmsProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Learning Management System (LMS) – Next.js',
  description: 'A modern, responsive Learning Management System (LMS) with AI-powered study assistance, course player, mock quizzes, teacher course editors, and admin dashboards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-50/50 text-gray-900 antialiased font-sans" suppressHydrationWarning>
        <LmsProvider>
          {children}
        </LmsProvider>
      </body>
    </html>
  );
}
