import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundVideo from "@/components/BackgroundVideo";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
});

export const metadata: Metadata = {
  title: "MusicShare - 好きな音楽をシェアしよう",
  description: "好きな音楽を紹介・共有できるWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenKaku.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <BackgroundVideo />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
      </body>
    </html>
  );
}
