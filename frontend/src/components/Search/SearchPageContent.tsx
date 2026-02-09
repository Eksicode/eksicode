"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IPost } from "@/types/types";
import { PostCard } from "@/components/PostCard";
import { SearchResults } from "@/components/Search/SearchResults";
import type { SearchResponse } from "@/services/searchService";
import type { PaginationMeta } from "@/types/hashtag.types";

const SEARCH_PLACEHOLDER =
  "Başlık, içerik, yazar, kategori veya etiketlerde ara...";

interface SearchPageContentProps {
  /** Current search query (empty when showing latest posts). */
  searchTerm: string;
  /** When searchTerm is set: search API response. */
  searchResults?: SearchResponse | null;
  /** When searchTerm is set: current page number. */
  currentPage?: number;
  /** When searchTerm is empty: latest posts to list. */
  latestPosts?: IPost[];
  /** When searchTerm is empty: pagination meta for latest posts. */
  latestMeta?: { total: number; totalPages: number };
}

export function SearchPageContent({
  searchTerm,
  searchResults = null,
  currentPage = 1,
  latestPosts = [],
  latestMeta,
}: SearchPageContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/arama?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/arama");
    }
  };

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="flex flex-wrap justify-center w-full p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
      <h1 className="flex w-full justify-center text-3xl font-bold text-center mb-4">
        {hasSearch ? "Arama Sonuçları" : "Gönderi Arama"}
      </h1>

      {/* Search form – project colors (eksiCode) */}
      <div className="w-full max-w-2xl mb-4">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-eksiCode focus:border-eksiCode dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-eksiCode dark:focus:border-eksiCode"
              placeholder={SEARCH_PLACEHOLDER}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Temizle"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!query.trim()}
            className="p-3 ml-2 text-sm font-medium text-white bg-eksiCode rounded-lg border border-eksiCode hover:bg-eksiCodeMedium focus:ring-4 focus:outline-none focus:ring-eksiCode/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="sr-only">Ara</span>
          </button>
        </form>
      </div>

      {hasSearch ? (
        <>
          {searchTerm && (
            <div className="w-full text-center mb-4">
              <h2 className="text-xl mb-2">
                Arama Terimi:{" "}
                <span className="font-medium text-eksiCode">"{searchTerm}"</span>
              </h2>
              {searchResults && searchResults.meta.total > 0 && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchResults.meta.total} sonuç bulundu
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4 max-w-md w-full">
          Kapsamlı arama: yazı başlıkları, içerikleri, yazar adları, kategoriler
          ve etiketler arasında arama yapabilirsiniz. Arama yapmadan önce en
          son gönderiler aşağıda listelenir.
        </p>
      )}
    </div>
  );
}

interface SearchPageContentWithResultsProps {
  searchTerm: string;
  searchResults?: SearchResponse | null;
  currentPage?: number;
  latestPosts?: IPost[];
  latestMeta?: { total: number; totalPages: number };
}

/** Wrapper that renders SearchPageContent plus results or latest posts list. */
export function SearchPageContentWithResults({
  searchTerm,
  searchResults = null,
  currentPage = 1,
  latestPosts = [],
  latestMeta,
}: SearchPageContentWithResultsProps) {
  const hasSearch = searchTerm.trim().length > 0;

  return (
    <>
      <SearchPageContent
        searchTerm={searchTerm}
        searchResults={hasSearch ? searchResults : null}
        currentPage={currentPage}
        latestPosts={latestPosts}
        latestMeta={latestMeta}
      />

      <div className="mt-8">
        {hasSearch && searchResults ? (
          <SearchResults
            searchResults={searchResults}
            searchTerm={searchTerm}
            currentPage={currentPage}
          />
        ) : (
          <LatestPostsList posts={latestPosts} meta={latestMeta} />
        )}
      </div>
    </>
  );
}

interface LatestPostsListProps {
  posts: IPost[];
  meta?: { total: number; totalPages: number };
}

function LatestPostsList({ posts, meta }: LatestPostsListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 rounded-lg border bg-white dark:bg-DarkerGrey border-gray-300 dark:border-DarkLightGrey">
        Henüz gönderi bulunmuyor.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Son Gönderiler
        </h2>
        {meta && meta.total > posts.length && (
          <Link
            href="/posts"
            className="text-sm font-medium text-eksiCode hover:text-eksiCodeMedium transition-colors"
          >
            Tüm gönderiler ({meta.total})
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {posts.map((post: IPost) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Link
            href="/posts"
            className="px-4 py-2 text-sm font-medium text-white bg-eksiCode rounded-lg hover:bg-eksiCodeMedium transition-colors"
          >
            Tüm gönderileri görüntüle
          </Link>
        </div>
      )}
    </div>
  );
}

// Default export for Next.js client boundary (fixes "promise resolves to undefined" lazy load error)
export default SearchPageContentWithResults;
