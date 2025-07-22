"use client";

import React, { useState, useEffect, useCallback } from "react";
import { IPost } from "@/types/types";
import { PostCard } from "./PostCard";
import LoadMore from "@/components/LoadMore";

interface PostsProps {
  initialPosts?: IPost[];
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

const Posts: React.FC<PostsProps> = ({ initialPosts = [] }) => {
  const [postItems, setPostItems] = useState<IPost[]>(initialPosts);
  const [skip, setSkip] = useState<number>(initialPosts.length);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const limit: number = 5; // Updated to match API default

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?summaryOnly=true&limit=${limit}&skip=${skip}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data: newPosts, meta }: FetchPostsResponse = await response.json();

      setTotalPosts(meta.total);
      setPostItems((prevPosts) => [...prevPosts, ...newPosts]);
      // Check if we have more posts based on current page vs total pages
      setHasMore(meta.currentPage < meta.totalPages);
      setSkip((prevSkip) => prevSkip + limit);

    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error instanceof Error ? error.message : "Gönderiler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [skip, loading, hasMore]);

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
        {postItems.length > 0 ? (
          postItems.map((post, index) => (
            <PostCard key={post.id || index} post={post} />
          ))
        ) : !loading && !error ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Henüz gönderi bulunmuyor
          </div>
        ) : null}
      </div>
    </LoadMore>
  );
};

export default Posts;