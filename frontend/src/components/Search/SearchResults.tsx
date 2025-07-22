"use client";
import { IPost } from "@/types/types";
import { PostCard } from "@/components/PostCard";
import { Suspense } from "react";
import Pagination from "@/components/Pagination";
import type { SearchResponse } from "@/services/searchService";

interface SearchResultsProps {
  searchResults: SearchResponse;
  searchTerm: string;
  currentPage: number;
}

export function SearchResults({ searchResults, searchTerm, currentPage }: SearchResultsProps) {
  const { posts, meta, message } = searchResults;

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Sonuç Bulunamadı
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          "{searchTerm}" için hiç sonuç bulunamadı. Farklı anahtar kelimeler deneyin.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="text-center py-8">Yükleniyor...</div>}>
      <div className="space-y-6">
        {/* Results Info */}
        <div className="bg-white dark:bg-DarkerGrey border border-gray-300 dark:border-DarkLightGrey rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sayfa {meta.page} / {meta.totalPages} - Toplam {meta.total} sonuç
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post: IPost) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={(postId: number) => console.log("Like:", postId)}
              onComment={(postId: number) => console.log("Comment:", postId)}
              onSave={(postId: number) => console.log("Save:", postId)}
            />
          ))}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <Pagination 
            meta={meta} 
            baseUrl={`/arama?q=${encodeURIComponent(searchTerm)}`}
          />
        )}
      </div>
    </Suspense>
  );
}