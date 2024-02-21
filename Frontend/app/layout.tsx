import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import React from "react";
import Nav from '../components/Nav/Nav'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ekşicode - Yazılımcı Geliştirme Platformu",
  description:
    "Telegram grupları üzerinden her seviyeden yazılım geliştiricinin ve yazılım öğrenmek isteyen kişilerin bir araya geldiği platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={
          process.env.NODE_ENV === "development"
            ? inter.className + " debug-screens"
            : "" + " " + inter.className
        }
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
