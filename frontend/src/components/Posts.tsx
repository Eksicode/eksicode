"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { IPost } from "@/types/types";
import { PostCard } from "./PostCard";
import Link from "next/link";
import Button from "@/components/Ui/Button";

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
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?summaryOnly=false&limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const { data: newPosts, meta }: FetchPostsResponse = await response.json();

      setTotalPosts(meta.total);
      setPostItems((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length === limit);
      setSkip((prevSkip: number) => prevSkip + limit);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, loading, hasMore]);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loading) {
        fetchPosts();
      }
    };
  
    const observerOptions: IntersectionObserverInit = {
      rootMargin: "100px",
      threshold: 0.1,
    };
  
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const currentButton = loadMoreButtonRef.current;

    if (currentButton) {
      observer.observe(currentButton);
    }

    return () => {
      if (currentButton) {
        observer.unobserve(currentButton);
      }
    };
  }, [fetchPosts, loading]);

  const generateRandomNumber = (): number => Math.floor(Math.random() * 1000);

  return (
    <>
      <div className="flex justify-center w-full flex-wrap">
        {postItems.map((post) => (
            <PostCard key={generateRandomNumber()} post={post} />
        ))}
      </div>
      <div className="flex justify-center w-full">
      {postItems.length < totalPosts && (
        <div className="text-center mt-4">
          <Button
            onClick={fetchPosts}
            disabled={loading}
            variant="secondary"
            clasName={`${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}          >
            {loading ? "Yükleniyor..." : "Daha Fazla Göster"}
          </Button>
        </div>
      )}
      <button ref={loadMoreButtonRef} className="invisible"></button>
      </div>
    </>
  );
};

export default Posts;
