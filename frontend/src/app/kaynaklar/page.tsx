import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import DataTable from "@/components/Ui/DataTable";
import Pagination from "@/components/Pagination";
import SourcesSearch from "@/components/SourcesSearch";
import { getAllSources, searchSources } from "@/services/sourceService";
import type { Source, Hashtag } from "@/services/sourceService";

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

interface SourcesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Sources({ searchParams }: SourcesPageProps) {
  // Extract pagination parameters from search params
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const limit = resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit, 10) : 10;
  const searchQuery = resolvedSearchParams.search || "";

  // Fetch sources using the service
  const sourcesData = searchQuery
    ? await searchSources(searchQuery, page, limit)
    : await getAllSources(page, limit, {
        next: { revalidate: 43200 }, // 12 hours cache
      });

  const formatHashtags = (tags: Hashtag[]): string => {
    return tags.map(hashtag => "#" + hashtag.name).join(", ");
  };

  const preparedData = sourcesData.data.map((source: Source) => ({
    title: source.title,
    description: source.description,
    url: source.url,
    hashtags: formatHashtags(source.tags),
  }));

  // Show error state if no data
  if (!sourcesData.data || sourcesData.data.length === 0) {
    return (
      <div className="flex py-5 basis-3/4">
        <SideMenu />
        <div className="flex flex-wrap w-full justify-center text-center">
          <div className="flex flex-col items-center justify-center w-full bg-white mx-2 p-8 rounded-lg border-gray-300 border text-gray-600 dark:bg-DarkerGrey dark:border-DarkLightGrey dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Kaynak Bulunamadı</h2>
            <p className="text-gray-500">
              {searchQuery 
                ? `"${searchQuery}" araması için sonuç bulunamadı.`
                : "Henüz hiç kaynak eklenmemiş veya veriler yüklenirken bir hata oluştu."
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex py-5 basis-3/4">
      <SideMenu />
      <div className="flex flex-wrap w-full justify-center text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-between w-full bg-white dark:bg-DarkerGrey dark:border-DarkLightGrey mx-2 p-4 rounded-lg border-gray-300 border text-gray-600 dark:text-white">
          <div className="text-3xl text-bold mb-4 lg:mb-0">
            Kaynaklar
            {sourcesData.meta && (
              <span className="text-sm font-normal ml-2 text-gray-500">
                ({sourcesData.meta.total} kaynak)
              </span>
            )}
            {searchQuery && (
              <span className="text-lg font-normal ml-2 text-blue-600 dark:text-blue-400">
                "{searchQuery}" için sonuçlar
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <SourcesSearch className="max-w-md" />
          </div>
        </div>

        <DataTable
          data={preparedData}
          onView={false}
          onEdit={false}
          onDelete={false}
        />
        
        {/* Pagination */}
        {sourcesData.meta && (
          <Pagination meta={sourcesData.meta} baseUrl="/kaynaklar" />
        )}
      </div>
    </div>
  );
}