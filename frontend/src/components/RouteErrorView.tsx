"use client";

import React, { useEffect } from "react";
import Button from "@/components/Ui/Button";
import { getUserFacingMessage } from "@/utils/errors";

interface RouteErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Page title shown above the error (e.g. "Arama", "Etiketler") */
  pageTitle?: string;
  /** Short context (e.g. "Arama yaparken", "Etiketler yüklenirken") - used in dev details only */
  context?: string;
  /** Optional left sidebar (e.g. SideMenu) */
  sidebar?: React.ReactNode;
  /** Optional wrapper class for layout */
  className?: string;
}

/**
 * Shared error view for route-level error.tsx pages.
 * Uses centralized user-facing messages and consistent UI.
 */
export default function RouteErrorView({
  error,
  reset,
  pageTitle,
  context,
  sidebar,
  className = "",
}: RouteErrorViewProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && context) {
      console.error(`[${context}]`, error);
    }
  }, [error, context]);

  const userMessage = getUserFacingMessage(error);

  const content = (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4"
        aria-hidden
      >
        <svg
          className="w-full h-full"
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
      {pageTitle && (
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {pageTitle}
        </h1>
      )}
      <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
        Bir hata oluştu
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {userMessage}
      </p>
      {process.env.NODE_ENV === "development" && (
        <details className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-2xl w-full">
          <summary className="cursor-pointer font-semibold mb-2 text-gray-600 dark:text-gray-400">
            Hata detayları (geliştirici)
          </summary>
          <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
            {error.message}
            {error.digest ? `\nDigest: ${error.digest}` : ""}
          </pre>
        </details>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={reset} variant="primary">
          Tekrar dene
        </Button>
        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/")}
        >
          Ana sayfaya dön
        </Button>
      </div>
    </div>
  );

  const wrapperClass = sidebar
    ? "flex py-5 basis-3/4 min-h-screen"
    : "flex flex-wrap w-full justify-center text-center";

  return (
    <div className={`${wrapperClass} ${className}`} role="alert" aria-live="assertive">
      {sidebar && <div className="flex">{sidebar}</div>}
      <div className="flex-1 flex flex-wrap w-full justify-center">
        <div className="flex flex-col items-center justify-center w-full bg-white dark:bg-DarkerGrey border border-gray-300 dark:border-DarkLightGrey rounded-lg text-gray-800 dark:text-white min-h-[400px] mx-2 p-8">
          {content}
        </div>
      </div>
    </div>
  );
}
