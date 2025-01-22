import type { Metadata } from "next";
import "@/styles/globals.css";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { Roboto } from "next/font/google";

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
      <body className={` ${process.env.NODE_ENV === "development"
            ? roboto.className + " debug-screens"
            : roboto.className} antialiased`}>
        <Providers>
          <div className="bg-gray-100 text-black dark:text-white dark:bg-DarkGrey">
            <Nav />
            <div className="flex flex-wrap w-full justify-center">
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
