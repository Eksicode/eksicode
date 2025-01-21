"use client";

import Search from "@/components/Search";
import { SearchResults } from "@/components/SearchResults";

export function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const searchTerm = searchParams.q;

  return (
    <>
      {searchTerm && (
        <div className="mt-8">
          <h2 className="text-xl mb-4">
            Arama Terimleri: <span className="font-medium">{searchTerm}</span>
          </h2>
          <SearchResults searchTerm={searchTerm} />
        </div>
      )}
    </>
  );
}
