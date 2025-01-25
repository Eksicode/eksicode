"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { IPost } from "@/types/types";
import { PostCard } from "./PostCard";
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
  const [skip, setSkip] = useState<number>(Number(initialPosts.length));
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const limit: number = 2;
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?summaryOnly=false&limit=${limit}&skip=${skip}`,
        {
          cache: "no-store",
          // next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const { data: newPosts, meta }: FetchPostsResponse =
        await response.json();

      setTotalPosts(Number(meta.total));
      setPostItems((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(Number(newPosts.length) === Number(limit));
      setSkip((prevSkip) => prevSkip + limit);

      console.log("response:", response);

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

  return (
    <>
      <div className="flex justify-center w-full flex-wrap">
        {postItems.map((post, index) => (
          <PostCard key={post.id || index} post={post} />
        ))}
      </div>
      <div className="flex justify-center w-full">
        {postItems.length < totalPosts && (
          <div className="text-center mt-4">
            <Button
              onClick={fetchPosts}
              disabled={loading}
              variant="secondary"
              style={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
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
