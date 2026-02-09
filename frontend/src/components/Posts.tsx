"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IPost } from "@/types/types";
import { PostCard } from "./PostCard";
import LoadMore from "@/components/LoadMore";
import { getUserFacingMessage, getErrorFromStatus } from "@/utils/errors";

interface PostsProps {
  initialPosts?: IPost[];
  /** When using SSR, pass meta from initial fetch so total/hasMore are correct on first paint */
  initialMeta?: { total: number; totalPages: number };
}

interface FetchPostsResponse {
  data: IPost[];
  meta: {
    total: number;
    skip: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    summaryOnly: boolean;
  };
  message: string;
}

const Posts: React.FC<PostsProps> = ({ initialPosts = [], initialMeta }) => {
  const [postItems, setPostItems] = useState<IPost[]>(initialPosts);
  const [skip, setSkip] = useState<number>(initialPosts.length);
  const [hasMore, setHasMore] = useState<boolean>(
    initialMeta ? 1 < initialMeta.totalPages : true
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPosts, setTotalPosts] = useState<number>(initialMeta?.total ?? 0);
  const [error, setError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);

  const limit: number = 5; // Updated to match API default
  const maxRetries: number = 3;

  // Memoized API URL to prevent unnecessary re-renders
  const apiUrl = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_API_URL}/posts?summaryOnly=true&limit=${limit}&skip=${skip}`;
  }, [skip]);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const bodyMessage = errorData?.message ?? errorData?.errors?.[0]?.message;
        const appError = getErrorFromStatus(response.status, bodyMessage);
        setError(appError.userMessage);
        setRetryCount((prev) => prev + 1);
        setLoading(false);
        return;
      }

      const { data: newPosts, meta }: FetchPostsResponse = await response.json();

      // Validate response data
      if (!Array.isArray(newPosts)) {
        throw new Error("Invalid response format: posts data is not an array");
      }

      setTotalPosts(meta.total);
      setPostItems((prevPosts) => [...prevPosts, ...newPosts]);
      // Check if we have more posts based on current page vs total pages
      setHasMore(meta.currentPage < meta.totalPages);
      setSkip((prevSkip) => prevSkip + limit);
      setRetryCount(0); // Reset retry count on success

    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching posts:", error);
      }
      setError(getUserFacingMessage(error));
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, loading, hasMore, limit]);

  // Auto-retry on error with exponential backoff
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      const timer = setTimeout(() => {
        fetchPosts();
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, fetchPosts]);

  // Handle retry manually
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setError("");
    fetchPosts();
  }, [fetchPosts]);

  // Memoized posts rendering to prevent unnecessary re-renders
  const renderedPosts = useMemo(() => {
    if (postItems.length === 0 && !loading && !error) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Henüz gönderi bulunmuyor
        </div>
      );
    }

    return postItems.map((post, index) => (
      <PostCard key={post.id || index} post={post} />
    ));
  }, [postItems, loading, error]);

  return (
    <LoadMore 
      onLoadMore={fetchPosts} 
      hasMore={hasMore} 
      loading={loading}
      totalItems={totalPosts}
      currentItems={postItems.length}
      error={error}
    >
      <div className="flex justify-center w-full flex-wrap">
        {renderedPosts}
      </div>
    </LoadMore>
  );
};

export default Posts;