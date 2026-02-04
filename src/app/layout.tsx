import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from '@/components/ui/sonner';
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Tech Villain - AI 기술 면접 토론',
  description: '기술 면접, AI한테 먼저 털리고 가라. 당신의 기술 선택을 까칠한 CTO가 검증합니다.',
  keywords: ['기술면접', '개발자', 'AI', '토론', '면접준비', 'Tech Villain'],
  authors: [{ name: 'Tech Villain' }],
  openGraph: {
    title: 'Tech Villain - AI 기술 면접 토론',
    description: '기술 면접, AI한테 먼저 털리고 가라.',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Villain - AI 기술 면접 토론',
    description: '기술 면접, AI한테 먼저 털리고 가라.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
