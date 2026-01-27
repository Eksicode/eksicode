import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap", // Optimize font loading
});

export const metadata: Metadata = {
  title: "Ekşicode - Yazılımcı Geliştirme Platformu",
  description:
    "Telegram grupları üzerinden her seviyeden yazılım geliştiricinin ve yazılım öğrenmek isteyen kişilerin bir araya geldiği platform.",
  keywords: ["yazılım", "geliştirici", "programlama", "ekşicode", "telegram", "topluluk"],
  authors: [{ name: "Ekşicode Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Ekşicode - Yazılımcı Geliştirme Platformu",
    description: "Yazılım geliştiriciler için yapıcı ve kapsayıcı bir sosyal ağ.",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekşicode - Yazılımcı Geliştirme Platformu",
    description: "Yazılım geliştiriciler için yapıcı ve kapsayıcı bir sosyal ağ.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${process.env.NODE_ENV === "development"
            ? roboto.className + " debug-screens"
            : roboto.className
          } antialiased`}
      >
        <Providers>
          <div className="bg-gray-100 text-black dark:text-white dark:bg-DarkGrey min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50">
              <Nav />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-wrap w-full justify-center">
              {children}
            </main>

            {/* Footer */}
            <footer className="mt-auto">
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
