import React from "react";
import SideMenu from "@/components/Nav/SideMenu";

export default function Loading() {
  // Create skeleton components for loading state
  const skeletonPosts = Array.from({ length: 5 }, (_, index) => (
    <div
      key={index}
      className="bg-white dark:bg-DarkerGrey border border-gray-300 dark:border-DarkLightGrey rounded-lg p-6 animate-pulse"
    >
      {/* Post header skeleton */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-1"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
        </div>
      </div>
      
      {/* Post title skeleton */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
      
      {/* Post content skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
      </div>
      
      {/* Post footer skeleton */}
      <div className="flex items-center space-x-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </div>
    </div>
  ));

  return (
    <div className="flex py-5 basis-3/4 min-h-screen">
      <div className="flex">
        <SideMenu />
      </div>
      <main className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center w-full p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
          <h1 className="flex w-full justify-center text-3xl font-bold text-center mb-4">
            Arama Sonuçları
          </h1>
          <div className="w-full text-center">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto animate-pulse"></div>
          </div>
        </div>
        
        <div className="mt-8 space-y-6">
          {/* Results info skeleton */}
          <div className="bg-white dark:bg-DarkerGrey border border-gray-300 dark:border-DarkLightGrey rounded-lg p-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-64 animate-pulse"></div>
          </div>
          
          {/* Posts skeleton */}
          <div className="space-y-4">
            {skeletonPosts}
          </div>
          
          {/* Pagination skeleton */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
