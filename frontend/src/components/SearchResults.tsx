"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPosts } from "@/app/arama/actions";
import { IPost } from "@/types/types";
import { PostCard } from "@/components/PostCard";

interface SearchResultsProps {
  searchTerm: string;
}

export function SearchResults({ searchTerm }: { searchTerm: string }) {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<IPost[]>({
    queryKey: ["posts", searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: Boolean(searchTerm),
  });

  if (isLoading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <>
        <div className="text-center py-8 text-red-500">
          Sonuçlar yüklenirken hata oluştu...
        </div>
        <div className="text-center text-sm py-8 text-red-500">
          {error && error.message}
        </div>
      </>
    );
  }

  if (!posts?.length) {
    return <div className="text-center py-8">Sonuç Bulunamadı</div>;
  }

  return (
    <div className="space-y-4">
      {posts?.map((post: IPost) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={(id: string) => console.log("Like:", id)}
          onComment={(id: string) => console.log("Comment:", id)}
          onSave={(id: string) => console.log("Save:", id)}
        />
      ))}
    </div>
  );
}
