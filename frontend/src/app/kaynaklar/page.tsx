import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import DataTable from "@/components/Ui/DataTable";
import getData from "@/utils/getData";
import Pagination from "@/components/Ui/Pagination";

interface Hashtag {
  id: number;
  name: string;
}

interface Source {
  id: number;
  title: string;
  description: string;
  url: string;
  tgChannel: string | null;
  tgUser: string | null;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  hashtags: Hashtag[];
}

interface Meta {
  total: number;
  skip: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

interface SourcesResponse {
  data: Source[];
  meta: Meta;
  message: string;
}

export default async function Sources() {
  const sourcesData: SourcesResponse = await getData("sources", false, 10);

  const formatHashtags = (hashtags: Hashtag[]): string => {
    return hashtags.map(hashtag => hashtag.name).join(", ");
  };

  const preparedData = sourcesData.data.map((source) => ({
    title: source.title,
    description: source.description,
    url: source.url,
    hashtags: formatHashtags(source.hashtags),
  }));

  return (
    <div className="flex py-5 basis-3/4">
      <SideMenu />
      <div className="flex flex-wrap w-full justify-center text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-between w-full bg-white dark:bg-DarkerGrey dark:border-DarkLightGrey mx-2 p-4 rounded-lg border-gray-300 border text-gray-600 dark:text-white">
          <h1 className="flex text-3xl text-bold text-left">Kaynaklar</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ara"
              className="placeholder:text-gray-900 bg-white dark:placeholder:text-white dark:bg-DarkerGrey border-b border-eksiCode p-2.5 text-sm"
            />
          </div>
        </div>

        <DataTable
          data={preparedData}
          onView={false}
          onEdit={false}
          onDelete={false}
        />
        
        <Pagination
          total={sourcesData.meta.total}
          totalPages={sourcesData.meta.totalPages}
          perPage={sourcesData.meta.limit}
          activePage={sourcesData.meta.currentPage}
        />
      </div>
    </div>
  );
}