"use client";

import { useEffect } from "react";
import { getUserFacingMessage } from "@/utils/errors";
import Button from "@/components/Ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root-level error boundary for the app.
 * Renders when an unhandled error occurs in the app tree.
 */
export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[App] Unhandled error:", error);
    }
  }, [error]);

  const userMessage = getUserFacingMessage(error);

  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full">
        <div className="text-red-500 dark:text-red-400 mb-4" aria-hidden>
          <svg
            className="w-16 h-16 mx-auto"
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
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          Bir hata oluştu
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {userMessage}
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <summary className="cursor-pointer font-semibold mb-2 text-gray-600 dark:text-gray-400">
              Hata detayları (geliştirici)
            </summary>
            <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
              {error.message}
              {error.digest ? `\nDigest: ${error.digest}` : ""}
            </pre>
          </details>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
    </div>
  );
}
