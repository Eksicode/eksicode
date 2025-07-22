"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Ui/Button";

interface LoadMoreProps {
  onLoadMore: () => void; // Callback to fetch more data
  hasMore: boolean; // Whether there are more items to load
  loading: boolean; // Whether data is currently being loaded
  children: React.ReactNode; // Content to render (e.g., posts list)
  totalItems?: number; // Total number of items available
  currentItems?: number; // Current number of items loaded
  error?: string; // Error message if loading failed
}

const LoadMore: React.FC<LoadMoreProps> = ({
  onLoadMore,
  hasMore,
  loading,
  children,
  totalItems,
  currentItems,
  error,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleLoadMore = () => {
    if (error) {
      setRetryCount(prev => prev + 1);
    }
    onLoadMore();
  };

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loading && !error) {
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
  }, [onLoadMore, hasMore, loading, error]);

  return (
    <>
      {children}
      
      {/* Progress indicator */}
      {totalItems && currentItems && (
        <div className="flex justify-center w-full mt-2 mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentItems} / {totalItems} gönderi gösteriliyor
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div ref={observerRef} className="flex flex-col items-center w-full justify-center text-center mt-4 space-y-2">
          {error && (
            <div className="text-red-500 text-sm mb-2">
              {error} {retryCount > 0 && `(Deneme: ${retryCount})`}
            </div>
          )}
          
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="secondary"
            style={`${loading ? "opacity-50 cursor-not-allowed" : ""} min-w-[200px]`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Yükleniyor...</span>
              </div>
            ) : error ? (
              "Tekrar Dene"
            ) : (
              "Daha Fazla Göster"
            )}
          </Button>
        </div>
      )}

      {/* End of content message */}
      {!hasMore && currentItems && currentItems > 0 && (
        <div className="flex justify-center w-full mt-4 mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tüm gönderiler yüklendi
          </p>
        </div>
      )}
    </>
  );
};

export default LoadMore;