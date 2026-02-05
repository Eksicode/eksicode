import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import SearchInput from "@/components/SearchInput";
import { SearchResults } from "@/components/Search/SearchResults";
import { searchPostsByTerm } from "@/services/searchService";

export const metadata = {
  title: "Ekşicode - Arama Sonuçları",
  description: "Ekşicode gönderi arama sonuçları",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.q || '';
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;

  // If no search term, show search interface
  if (!searchTerm.trim()) {
    return (
      <div className="flex py-5 basis-full xl:basis-3/4 min-h-screen">
        <div className="flex">
          <SideMenu />
        </div>
        <main className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center w-full p-6 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
            <h1 className="flex w-full justify-center text-3xl font-bold text-center mb-6">
              Gönderi Arama
            </h1>
            <div className="w-full max-w-2xl">
              <SearchInput
                placeholder="Başlık, içerik, yazar, kategori veya etiketlerde ara..."
                className="w-full"
              />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 max-w-md">
              Kapsamlı arama: yazı başlıkları, içerikleri, yazar adları, kategoriler ve etiketler arasında arama yapabilirsiniz.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch search results
  const searchResults = await searchPostsByTerm(searchTerm, page, 10, {
    cache: "no-store" // Don't cache search results
  });

  return (
    <div className="flex py-5 basis-full xl:basis-3/4 min-h-screen">
      <div className="flex">
        <SideMenu />
      </div>
      <main className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center w-full p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
          <h1 className="flex w-full justify-center text-3xl font-bold text-center mb-4">
            Arama Sonuçları
          </h1>
          <div className="w-full text-center mb-4">
            <h2 className="text-xl mb-2">
              Arama Terimi: <span className="font-medium">"{searchTerm}"</span>
            </h2>
            {searchResults.meta.total > 0 && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchResults.meta.total} sonuç bulundu
              </p>
            )}
          </div>

          {/* Search Input for refining search */}
          <div className="w-full max-w-2xl">
            <SearchInput
              placeholder="Başlık, içerik, yazar, kategori veya etiketlerde ara..."
              className="w-full"
              defaultValue={searchTerm}
            />
          </div>
        </div>

        <div className="mt-8">
          <SearchResults
            searchResults={searchResults}
            searchTerm={searchTerm}
            currentPage={page}
          />
        </div>
      </main>
    </div>
  );
}
