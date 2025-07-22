import React from "react";
import Link from "next/link";
import Button from "@/components/Ui/Button";
import type { Hashtag } from "@/types/hashtag.types";

function TagsCard(hashtag: Hashtag) {
  return (
    <div key={hashtag.id} className="relative flex items-start flex-col justify-start text-gray-700 dark:text-white bg-white dark:bg-DarkerGrey dark:border-DarkLightGrey border border-gray-200 shadow-md bg-clip-border rounded-xl w-[45%] lg:w-[30%] p-2 m-2">
      <div className="p-4">
        <h4 className="mb-2 font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          <Link href={`/arama?q=${hashtag.slug}`}>#{hashtag.name}</Link>
        </h4>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400">
          {hashtag.postCount} yazı
        </p>
      </div>
      <p className="h-20 px-4">{hashtag.description}</p>
      <div className="flex flex-col lg:flex-row w-full gap-2 flex-nowrap p-4">
        <Button
        // href="/uye-ol"
        >
          Takip Et
        </Button>
        <Button
          variant="secondary"
        // href="/uye-giris"
        >
          Gizle
        </Button>
        {hashtag.icon && (
          <div className="flex items-center justify-center">
            {hashtag.icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default TagsCard;
