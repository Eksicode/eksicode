"use client"; // <-- Add this directive

import React, { useState, useEffect, useCallback } from "react";
import { IPost } from "@/types/types";
import { PostCard } from "./PostCard";
import LoadMore from "@/components/LoadMore"; // Ensure this import is correct

interface PostsProps {
  initialPosts?: IPost[];
}

interface FetchPostsResponse {
  data: IPost[];
  meta: {
    total: number;
  };
}

const Posts: React.FC<PostsProps> = ({ initialPosts = [] }) => {
  const [postItems, setPostItems] = useState<IPost[]>(initialPosts);
  const [skip, setSkip] = useState<number>(initialPosts.length);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const limit: number = 2;

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?summaryOnly=false&limit=${limit}&skip=${skip}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const { data: newPosts, meta }: FetchPostsResponse = await response.json();

      setTotalPosts(meta.total);
      setPostItems((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length === limit);
      setSkip((prevSkip) => prevSkip + limit);

      console.log("Fetched posts:", newPosts);
      console.log("Total posts:", totalPosts);
      console.log("Has more:", hasMore);
      console.log("Skip:", skip);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, loading, hasMore]);

  return (
    <LoadMore onLoadMore={fetchPosts} hasMore={hasMore} loading={loading}>
      <div className="flex justify-center w-full flex-wrap">
        {postItems.map((post, index) => (
          <PostCard key={post.id || index} post={post} />
        ))}
      </div>
    </LoadMore>
  );
};

export default Posts;