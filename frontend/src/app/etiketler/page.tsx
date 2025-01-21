import React from "react";
import Link from "next/link";
import SideMenu from "@/components/Nav/SideMenu";
import TagsCard from "@/components/TagsCard";
import Search from "@/components/Search";

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
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/hashtags", {
      next: { revalidate: 43200 },
    });
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
    <div className="flex py-5 md:basis-3/4">
      <div className="flex">
        <SideMenu />
      </div>
      <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-center">
        <div className="flex flex-wrap justify-center w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
          <div className="flex basis-1/2 text-3xl text-bold text-left">
            Etiketler
          </div>

          <div className="flex flex-nowrap basis-1/2">
            <button className="p-2 border w-full hover:border hover:bg-eksiCode rounded-lg hover:text-white text-dark">
              Takipteki Etiketler
            </button>
            <button className="mx-2 p-2 w-full border hover:border hover:bg-eksiCode rounded-lg hover:text-white text-dark">
              Gizli Etiketler
            </button>
            <Search />
          </div>
        </div>

        <div className="flex flex-wrap w-full justify-between sm:mx-2">
          {tags.data?.map((tag: Tag) => (
            <TagsCard key={tag.id} {...tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
