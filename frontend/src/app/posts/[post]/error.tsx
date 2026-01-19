"use client";

import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error state for post detail page
 */
export default function PostError({ error, reset }: ErrorProps) {
  return (
    <div className="flex py-5 basis-3/4">
      {/* Left Sidebar - Menu */}
      <div className="flex">
        <SideMenu />
      </div>

      {/* Error Content */}
      <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-2 p-8 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
          {/* Error Icon */}
          <div className="text-6xl mb-4">⚠️</div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold mb-2 text-center">
            Gönderi Yüklenirken Hata Oluştu
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            {error.message || "Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin."}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="px-6 py-2 bg-eksiCode text-white rounded-lg hover:bg-eksiCode/90 transition-colors duration-200"
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="px-6 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-8 w-full">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Hata Detayları (Geliştirici Modu)
              </summary>
              <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto">
                {error.stack || error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
