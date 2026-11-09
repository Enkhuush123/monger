import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Monger | Монголын Шинэ Үеийн Портал & Хайлтын Систем",
  description: "Хайлт, шуурхай мэдээ, чөлөөт блог, шилдэг газруудын нэгдсэн экосистем.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#070b09] text-zinc-100">{children}</body>
    </html>
  );
}
