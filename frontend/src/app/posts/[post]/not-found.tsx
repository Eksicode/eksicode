import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import Link from "next/link";

/**
 * Not Found state for post detail page
 */
export default function PostNotFound() {
  return (
    <div className="flex py-5 basis-3/4">
      {/* Left Sidebar - Menu */}
      <div className="flex">
        <SideMenu />
      </div>

      {/* Not Found Content */}
      <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-2 p-12 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
          {/* Not Found Icon */}
          <div className="text-8xl mb-6">📭</div>

          {/* Not Found Title */}
          <h1 className="text-3xl font-bold mb-3 text-center">
            Gönderi Bulunamadı
          </h1>

          {/* Not Found Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
            Aradığınız gönderi bulunamadı. Gönderi silinmiş, taşınmış veya hiç var olmamış olabilir.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-eksiCode text-white rounded-lg hover:bg-eksiCode/90 transition-colors duration-200 font-medium"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/posts"
              className="px-6 py-3 border border-gray-300 dark:border-DarkLightGrey rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Tüm Gönderiler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
