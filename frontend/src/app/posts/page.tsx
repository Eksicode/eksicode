import React, { Suspense } from 'react';
import Posts from '@/components/Posts';
import SideMenu from '@/components/Nav/SideMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tüm Gönderiler - EksiCode',
  description: 'EksiCode platformundaki tüm gönderileri keşfedin.',
};

/**
 * Posts loading skeleton
 */
function PostsLoading() {
  return (
    <div className="flex justify-center w-full flex-wrap">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="py-4 w-full px-1 mb-3 bg-white dark:bg-DarkerGrey rounded-lg border border-gray-300 dark:border-DarkLightGrey animate-pulse"
        >
          <div className="flex flex-wrap mx-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 w-10 h-10" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
            </div>
            <div className="w-full ml-0 lg:ml-14 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Posts Page - Display all posts
 */
export default function PostsPage() {
  return (
    <div className="flex py-5 basis-3/4">
      {/* Left Sidebar - Menu */}
      <div className="flex">
        <SideMenu />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-wrap lg:w-7/12 w-full mx-2">
        <div className="w-full mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Tüm Gönderiler
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            EksiCode topluluğunun paylaştığı tüm gönderileri keşfedin.
          </p>
        </div>

        {/* Posts Section with Loading State */}
        <Suspense fallback={<PostsLoading />}>
          <Posts />
        </Suspense>
      </div>
    </div>
  );
}
