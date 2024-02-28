import React from "react";
import Link from "next/link";
import SideMenu from "@components/SideMenu";
import TagsCard from "@components/TagsCard";
import Search from "@components/Search";

interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
  icon: string;
  description: string;
}

type TagsProps = {
  tags?: Tag[];
};

async function getData() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/tags");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
export default async function Tags() {
  const tags = await getData();

  return (
    <div className="flex w-full justify-center pt-5 font-eksifont bg-eksiContent">
      <div className="flex w-3/4">
        <div className="flex w-1/3">
          <SideMenu />
        </div>
        <div className="flex flex-wrap w-2/3 sm:w-full md:w-full justify-center text-center">
          <div className="flex w-full bg-white mx-2 p-2 justify-between rounded-lg border-coolGray-800 border-2 text-gray-600">
            <p className="flex w-1/2 text-3xl text-bold text-left mb-4">Etiketler</p>
            <p className="felex flex-nowrap w-1/2 mb-4">
              <button className="p-2 border hover:border hover:bg-eksiCode rounded-lg hover:text-white text-dark">
                Takipteki Etiketler
              </button>
              <button className="mx-2 p-2 border hover:border hover:bg-eksiCode rounded-lg hover:text-white text-dark">
                Gizli Etiketler
              </button>
              <Search text="Etiket ara" />
            </p>
          </div>
          <div className="flex flex-wrap w-full justify-between sm:mx-2">
            {tags.data?.map((tag: Tag) => (
              <TagsCard {...tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
