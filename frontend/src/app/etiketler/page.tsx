import React from "react";
import Link from "next/link";
import SideMenu from "@/components/Nav/SideMenu";
import TagsCard from "@/components/TagsCard";
import Button from "@/components/Ui/Button";
import Navlink from "@/components/Ui/NavLink";
import Pagination from "@/components/Pagination";
import EtiketlerSearch from "@/components/EtiketlerSearch";
import { getAllHashtags, searchHashtags } from "@/services/hashtagService";
import type { Hashtag } from "@/types/hashtag.types";

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

interface TagsPageProps {
  searchParams: SearchParams;
}

export default async function Tags({ searchParams }: TagsPageProps) {
  // Extract pagination parameters from search params
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit, 10) : 50;
  const searchQuery = searchParams.search || "";

  // Fetch hashtags using the service
  const hashtagsResponse = searchQuery
    ? await searchHashtags(searchQuery, page, limit)
    : await getAllHashtags(page, limit, {
        next: { revalidate: 43200 }, // 12 hours cache
      });

  // Show error state if no data
  if (!hashtagsResponse.data || hashtagsResponse.data.length === 0) {
    return (
      <div className="flex py-5 basis-3/4">
        <div className="flex">
          <SideMenu />
        </div>
        <div className="flex flex-wrap w-full justify-center text-center">
          <div className="flex flex-col items-center justify-center w-full bg-white mx-2 p-8 rounded-lg border-gray-300 border text-gray-600 dark:bg-DarkerGrey dark:border-DarkLightGrey dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Etiket Bulunamadı</h2>
            <p className="text-gray-500">
              Henüz hiç etiket eklenmemiş veya veriler yüklenirken bir hata
              oluştu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex py-5 basis-3/4">
      <div className="flex">
        <SideMenu />
      </div>
      <div className="flex flex-wrap w-full justify-center text-center">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600 dark:bg-DarkerGrey dark:border-DarkLightGrey dark:text-white">
          <div className="text-3xl text-bold mb-4 lg:mb-0">
            Etiketler
            {hashtagsResponse.meta && (
              <span className="text-sm font-normal ml-2 text-gray-500">
                ({hashtagsResponse.meta.total} etiket)
              </span>
            )}
            {searchQuery && (
              <span className="text-lg font-normal ml-2 text-blue-600 dark:text-blue-400">
                "{searchQuery}" için sonuçlar
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="w-full mx-2 mb-4">
              <EtiketlerSearch className="max-w-md" />
            </div>
            <Button variant="secondary" children="Takipteki Etiketler" />
            <Button variant="secondary" children="Gizli Etiketler" />
          </div>
        </div>

        <div className="flex flex-wrap w-full justify-between lg:mx-0 mx-2">
          {hashtagsResponse.data?.map((hashtag: Hashtag) => (
            <TagsCard key={hashtag.id} {...hashtag} />
          ))}
        </div>

        {/* Pagination */}
        {hashtagsResponse.meta && (
          <Pagination meta={hashtagsResponse.meta} baseUrl="/etiketler" />
        )}
      </div>
    </div>
  );
}
