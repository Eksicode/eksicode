import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import SearchPageContentWithResults from "@/components/Search/SearchPageContent";
import { searchPostsByTerm } from "@/services/searchService";
import type { IPost } from "@/types/types";

export const metadata = {
  title: "Ekşicode - Arama Sonuçları",
  description: "Ekşicode gönderi arama sonuçları",
};

const LATEST_POSTS_LIMIT = 10;

interface FetchPostsResponse {
  data: IPost[];
  meta: {
    total: number;
    skip: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    summaryOnly?: boolean;
  };
  message: string;
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.q || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let latestPosts: IPost[] = [];
  let latestMeta: { total: number; totalPages: number } | undefined;
  let searchResults = null;

  if (searchTerm.trim()) {
    searchResults = await searchPostsByTerm(searchTerm, page, 10, {
      cache: "no-store",
    });
  } else {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        const res = await fetch(
          `${apiUrl}/posts?summaryOnly=true&limit=${LATEST_POSTS_LIMIT}&skip=0`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const json: FetchPostsResponse = await res.json();
          latestPosts = Array.isArray(json.data) ? json.data : [];
          if (json.meta) {
            latestMeta = {
              total: json.meta.total,
              totalPages: json.meta.totalPages,
            };
          }
        }
      }
    } catch {
      // Fallback to empty list
    }
  }

  return (
    <div className="flex py-5 basis-full xl:basis-3/4 min-h-screen">
      <div className="flex">
        <SideMenu />
      </div>
      <main className="container mx-auto px-4">
        <SearchPageContentWithResults
          searchTerm={searchTerm}
          searchResults={searchResults}
          currentPage={page}
          latestPosts={latestPosts}
          latestMeta={latestMeta}
        />
      </main>
    </div>
  );
}
