import React from "react";
import Link from "next/link";
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
    <div key={tag.id} className="relative flex items-start flex-col justify-start text-gray-700 bg-white border border-gray-200 shadow-md bg-clip-border rounded-xl w-[30%] p-2 m-2">
      <div className="p-4">
        <h4 className="mb-2 font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          <Link href={`/etiketler/${tag.slug}`}>#{tag.name}</Link>
        </h4>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400">
          {tag.postCount}
        </p>
      </div>
      <p className="h-20">{tag.description}</p>
      <div className="flex flex-nowrap">
        <button
          className=" border rounded-lg p-2 ml-3 hover:bg-white hover:text-eksiCode bg-eksiCode text-gray-50"
          // href="/uye-ol"
        >
          Takip Et
        </button>
        <button
          className="p-2 ml-3 border border-white hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark"
          // href="/uye-giris"
        >
          Gizle
        </button>
        <div>{tag.icon}</div>
        {/* <Image
        src={group.logo}
        alt="eksi-code-logo"
        className="h-20 w-20 rounded-full"
        width="80"
        height="80"
      /> */}
      </div>
    </div>
  );
}

export default TagsCard;
