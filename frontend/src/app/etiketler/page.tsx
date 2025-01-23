import React from "react";
import Link from "next/link";
import SideMenu from "@/components/Nav/SideMenu";
import TagsCard from "@/components/TagsCard";
import Search from "@/components/Search";
import Button from "@/components/Ui/Button";
import Navlink from "@/components/Ui/NavLink";

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
    <div className="flex py-5 basis-3/4">
      <div className="flex">
        <SideMenu />
      </div>
      <div className="flex flex-wrap w-full justify-center text-center">
        <div className="flex justify-between w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600 dark:bg-DarkerGrey dark:border-DarkLightGrey dark:text-white">
          <div className="text-3xl text-bold">
            Etiketler
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              children="Takipteki Etiketler"
            />
            <Button
              variant="secondary"
              children="Gizli Etiketler"
            />
            <div>
              <Search />
            </div>
          </div>
        </div>


        <div className="flex flex-wrap w-full justify-between mx-0 sm:mx-2">
          {tags.data?.map((tag: Tag) => (
            <TagsCard key={tag.id} {...tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
