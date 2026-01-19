import React from "react";
import SideMenu from "@/components/Nav/SideMenu";

/**
 * Loading state for post detail page
 */
export default function PostLoading() {
  return (
    <div className="flex py-5 basis-3/4">
      {/* Left Sidebar - Menu */}
      <div className="flex">
        <SideMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center">
        <div className="flex flex-wrap justify-start w-full max-w-4xl mx-2">
          {/* Post Card Skeleton */}
          <article className="w-full p-6 mb-4 rounded-lg border bg-white dark:bg-DarkerGrey border-gray-300 dark:border-DarkLightGrey animate-pulse">
            {/* Author Info Skeleton */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-DarkLightGrey">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 w-12 h-12" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>

            {/* Title Skeleton */}
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6" />

            {/* Tags Skeleton */}
            <div className="flex gap-2 mb-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
            </div>

            {/* Image Skeleton */}
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />

            {/* Content Skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-DarkLightGrey">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
