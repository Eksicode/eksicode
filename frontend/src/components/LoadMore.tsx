"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Ui/Button";

interface LoadMoreProps {
  onLoadMore: () => void; // Callback to fetch more data
  hasMore: boolean; // Whether there are more items to load
  loading: boolean; // Whether data is currently being loaded
  children: React.ReactNode; // Content to render (e.g., posts list)
}

const LoadMore: React.FC<LoadMoreProps> = ({
  onLoadMore,
  hasMore,
  loading,
  children,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    };

    const observerOptions: IntersectionObserverInit = {
      rootMargin: "100px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasMore, loading]);

  return (
    <>
      {children}
      {hasMore && (
        <div ref={observerRef} className="flex w-full justify-center text-center mt-4">
          <Button
              onClick={onLoadMore}
              disabled={loading}
              variant="secondary"
              style={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Yükleniyor..." : "Daha Fazla Göster"}
            </Button>
        </div>
      )}
    </>
  );
};

export default LoadMore;