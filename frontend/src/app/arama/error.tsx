'use client';

import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import Button from "@/components/Ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Search page error:', error);
  }, [error]);

  return (
    <div className="flex py-5 basis-3/4 min-h-screen">
      <div className="flex">
        <SideMenu />
      </div>
      <main className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center w-full p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
          <h1 className="flex w-full justify-center text-3xl font-bold text-center mb-4">
            Arama
          </h1>
        </div>
        
        <div className="mt-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
              Arama Hatası
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-center">
              Arama yaparken bir sorun oluştu. Lütfen tekrar deneyin.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-2xl">
                <summary className="cursor-pointer font-semibold mb-2">
                  Hata Detayları (Geliştirici Modu)
                </summary>
                <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4">
              <Button
                onClick={reset}
                variant="primary"
              >
                Tekrar Dene
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="secondary"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
