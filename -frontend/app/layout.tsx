import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@styles/globals.css";
import React from "react";
import Nav from "@components/Nav/Nav";
import Footer from "@components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./Providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

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
    <html lang="tr" className="dark" suppressHydrationWarning>
      <GoogleAnalytics gaId="UA-143778720-1" />
      <body
        className={
          process.env.NODE_ENV === "development"
            ? roboto.className + " debug-screens"
            : roboto.className
        }
      >
        <Providers>
          <div className="bg-gray-100 text-black dark:text-white dark:bg-green-800">
          <Nav />
          <div className="flex flex-wrap w-full justify-center pt-5">
            <div className="flex justify-center sm:basis-full md:basis-full lg:basis-full basis-3/4 sm:mx-2">
              {children}
            </div>
          </div>
          <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
