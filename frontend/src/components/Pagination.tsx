import React from "react";
import Link from "next/link";
import type { PaginationMeta } from "@/types/hashtag.types";

interface PaginationProps {
  meta: PaginationMeta;
  baseUrl?: string;
  /** Optional query params to preserve in page links (e.g. { search: "foo" }) */
  queryParams?: Record<string, string>;
}

const Pagination: React.FC<PaginationProps> = ({ meta, baseUrl = "/etiketler", queryParams }) => {
  const { page, totalPages } = meta;

  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value != null && value !== '') params.set(key, value);
      });
    }
    params.set('page', pageNum.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (page > 1) {
      pageNumbers.push(
        <Link
          key="prev"
          href={getPageUrl(page - 1)}
          className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Önceki
        </Link>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`px-3 py-2 leading-tight border border-gray-300 ${
            i === page
              ? 'text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          }`}
        >
          {i}
        </Link>
      );
    }

    // Next button
    if (page < totalPages) {
      pageNumbers.push(
        <Link
          key="next"
          href={getPageUrl(page + 1)}
          className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Sonraki
        </Link>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col items-center w-full mt-6">
      <span className="text-sm text-gray-700 dark:text-gray-400 mb-4">
        <span className="font-semibold text-gray-900 dark:text-white">{((page - 1) * meta.pageSize) + 1}</span>
        {' '}-{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {Math.min(page * meta.pageSize, meta.total)}
        </span>
        {' '}arası, toplam{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{meta.total}</span>
        {' '}sonuç gösteriliyor
      </span>
      
      <nav aria-label="Page navigation">
        <ul className="inline-flex -space-x-px text-sm">
          {renderPageNumbers()}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
