import React from "react";
import Link from "next/link";
import Button from "@/components/Ui/Button";

interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
  icon: string;
  description: string;
}

function TagsCard(tag: Tag) {
  return (
    <div key={tag.id} className="relative flex items-start flex-col justify-start text-gray-700 dark:text-white bg-white dark:bg-DarkerGrey dark:border-DarkLightGrey border border-gray-200 shadow-md bg-clip-border rounded-xl w-[30%] p-2 m-2">
      <div className="p-4">
        <h4 className="mb-2 font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          <Link href={`/etiketler/${tag.slug}`}>#{tag.name}</Link>
        </h4>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400">
          {tag.postCount}
        </p>
      </div>
      <p className="h-20">{tag.description}</p>
      <div className="flex gap-2 flex-nowrap">
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
        <div>{tag.icon}</div>
      </div>
    </div>
  );
}

export default TagsCard;
