import React, { Suspense } from "react";
import Posts from "@/components/Posts";
import SideMenu from "@/components/Nav/SideMenu";
import PostsSearch from "@/components/PostsSearch";
import { PostCard } from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";
import type { IPost } from "@/types/types";
import { searchPostsByTerm } from "@/services/searchService";

/** Always render on the server per request; no static generation or cache. */
export const dynamic = "force-dynamic";

const POSTS_LIST_LIMIT = 5;
const POSTS_SEARCH_LIMIT = 10;

interface PostsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PostsPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const q = resolved.q?.trim() || "";
  const title = q ? `"${q}" araması - Gönderiler - EksiCode` : "Tüm Gönderiler - EksiCode";
  const description = q
    ? `"${q}" için gönderi arama sonuçları.`
    : "EksiCode platformundaki tüm gönderileri keşfedin.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: q ? `/posts?q=${encodeURIComponent(q)}` : "/posts",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: q ? `/posts?q=${encodeURIComponent(q)}` : "/posts" },
  };
}

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
 * Posts Page - SSR with optional search (q) or list + load more
 */
export default async function PostsPage({ searchParams }: PostsPageProps) {
  const resolved = await searchParams;
  const searchQuery = resolved.q?.trim() || "";
  const page = resolved.page ? parseInt(resolved.page, 10) : 1;

  // Search mode: fetch search results from API
  if (searchQuery) {
    const searchResults = await searchPostsByTerm(
      searchQuery,
      page,
      POSTS_SEARCH_LIMIT,
      { cache: "no-store" }
    );
    const { posts, meta } = searchResults;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": posts.map((post: IPost, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${process.env.NEXT_PUBLIC_URL || "https://eksicode.org"}/posts/${post.slug}`
      }))
    };

    return (
      <div className="flex py-5 basis-full xl:basis-3/4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="flex">
          <SideMenu />
        </div>

        <div className="flex flex-wrap lg:w-7/12 w-full mx-2">
          <div className="w-full mb-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Gönderiler
                  {meta.total > 0 && (
                    <span className="text-sm font-normal ml-2 text-gray-500 dark:text-gray-400">
                      ({meta.total} sonuç)
                    </span>
                  )}
                </h1>
                {searchQuery && (
                  <span className="text-lg font-normal text-blue-600 dark:text-blue-400">
                    &quot;{searchQuery}&quot; için sonuçlar
                  </span>
                )}
              </div>
              <PostsSearch
                defaultValue={searchQuery}
                className="w-full sm:max-w-md"
              />
            </div>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="w-full text-center py-12 rounded-lg border bg-white dark:bg-DarkerGrey border-gray-300 dark:border-DarkLightGrey">
              <p className="text-gray-500 dark:text-gray-400">
                &quot;{searchQuery}&quot; için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full gap-4">
                {posts.map((post: IPost) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              {meta.totalPages > 1 && (
                <Pagination
                  meta={meta}
                  baseUrl="/posts"
                  queryParams={{ q: searchQuery }}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // List mode: SSR initial posts, then load more on client
  let initialPosts: IPost[] = [];
  let initialMeta: { total: number; totalPages: number } | undefined;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const res = await fetch(
        `${apiUrl}/posts?summaryOnly=true&limit=${POSTS_LIST_LIMIT}&skip=0`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const json: FetchPostsResponse = await res.json();
        initialPosts = Array.isArray(json.data) ? json.data : [];
        if (json.meta) {
          initialMeta = {
            total: json.meta.total,
            totalPages: json.meta.totalPages,
          };
        }
      }
    }
  } catch {
    // Fallback to client-side fetch only
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": initialPosts.map((post: IPost, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${process.env.NEXT_PUBLIC_URL || "https://eksicode.org"}/posts/${post.slug}`
    }))
  };

  return (
    <div className="flex py-5 basis-full xl:basis-3/4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex">
        <SideMenu />
      </div>

      <div className="flex flex-wrap lg:w-7/12 w-full mx-2">
        <div className="w-full mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Tüm Yazılar
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                EksiCode topluluğunun paylaştığı tüm gönderileri keşfedin.
              </p>
            </div>
            <PostsSearch className="w-full sm:max-w-md" />
          </div>
        </div>

        <Suspense fallback={<PostsLoading />}>
          <Posts initialPosts={initialPosts} initialMeta={initialMeta} />
        </Suspense>
      </div>
    </div>
  );
}
