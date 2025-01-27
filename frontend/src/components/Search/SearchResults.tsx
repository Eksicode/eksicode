"use client";
import { IPost } from "@/types/types";
import { PostCard } from "@/components/PostCard";
import { Suspense, useState, useEffect } from "react";
import LoadMore from "@/components/LoadMore";

interface SearchResultsProps {
  searchTerm: string;
}

interface ApiResponse {
  data: IPost[];
  message: string;
}

export function SearchResults({ searchTerm }: SearchResultsProps) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const limit = 10;

  const fetchPosts = async () => {
    try {
      const skip = (page - 1) * limit;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/search/${searchTerm}?skip=${skip}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const { data, message }: ApiResponse = await response.json();
      setPosts((prevPosts) => [...prevPosts, ...data]);
      setTotalCount(data.length);
      console.log(message);
    } catch (error) {
      console.error("Error searching posts:", error);
      setError("Failed to search posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (isLoading && page === 1) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!posts.length) {
    return <div className="text-center py-8">Sonuç Bulunamadı</div>;
  }

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <LoadMore
        onLoadMore={handleLoadMore}
        hasMore={posts.length < totalCount}
        loading={isLoading}
      >
        <div className="space-y-4">
          {posts.map((post: IPost) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={(id: string) => console.log("Like:", id)}
              onComment={(id: string) => console.log("Comment:", id)}
              onSave={(id: string) => console.log("Save:", id)}
            />
          ))}
        </div>
      </LoadMore>
    </Suspense>
  );
}