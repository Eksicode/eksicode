import Link from 'next/link';
import type { Metadata } from 'next';
import MatrixRain from '@/components/MatrixRain';
import Button from '@/components/Ui/Button';

export const metadata: Metadata = {
  title: '404 - Sayfa Bulunamadı | Ekşicode',
  description: 'Aradığınız sayfa bulunamadı. Ana sayfaya dönerek devam edebilirsiniz.',
  robots: 'noindex, nofollow',
};

/**
 * Global 404 Not Found page
 * Displays when a route doesn't match any page in the application
 */
export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Matrix Rain Background Animation */}
      <div className="absolute inset-0 z-0">
        <MatrixRain
          color="#82BD4E"
          backgroundColor="#000000"
          fontSize={15}
          speed={50}
          className="opacity-80"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-eksiCode drop-shadow-lg select-none">
            404
          </h1>
        </div>

        {/* Error Icon */}
        <div className="text-6xl mb-6 opacity-80 animate-bounce">🔍</div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-white">
          Sayfa Bulunamadı
        </h2>

        {/* Messages */}
        <div className="space-y-3 mb-8 text-white/90 dark:text-gray-300">
          <p className="text-lg md:text-xl font-medium">
            Yanlış hapı yuttunuz
          </p>
          <p className="text-base md:text-lg">
            Aradığınız sayfa bu evrende bulunamadı...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/">
            <Button
              variant="primary"
              style="px-6 py-3 text-base font-medium min-w-[200px] transition-transform hover:scale-105"
            >
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Link
            href="/posts"
            className="px-6 py-3 text-base font-medium min-w-[200px] bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-center hover:scale-105"
          >
            Tüm Gönderiler
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-white/10 w-full">
          <p className="text-sm text-white/70 dark:text-gray-400 mb-3">
            Belki şunlar ilginizi çekebilir:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/posts"
              className="text-eksiCode hover:text-eksiCodeLight underline underline-offset-2 transition-colors"
            >
              Gönderiler
            </Link>
            <Link
              href="/etiketler"
              className="text-eksiCode hover:text-eksiCodeLight underline underline-offset-2 transition-colors"
            >
              Etiketler
            </Link>
            <Link
              href="/kariyer"
              className="text-eksiCode hover:text-eksiCodeLight underline underline-offset-2 transition-colors"
            >
              Kariyer
            </Link>
            <Link
              href="/telegram-gruplari"
              className="text-eksiCode hover:text-eksiCodeLight underline underline-offset-2 transition-colors"
            >
              Telegram Grupları
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
