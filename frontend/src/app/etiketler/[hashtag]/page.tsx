import React from "react";
import Link from "next/link";
import SideMenu from "@/components/Nav/SideMenu";
import Image from "next/image";
import { IPost } from "@/types/types";
import { notFound } from "next/navigation";

export default async function Hashtag({
  params,
}: {
  params: { hashtag: string };
}) {
  try {
    const hashtagParam = params.hashtag;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hastags/${params.hashtag}`,
      {
        cache: "force-cache",
      }
    );
    if (response.status === 404) {
      notFound();
    }
    const hashtagData: IPost = await response.json();

    return (
      <>
        <div className="flex basis-3/4 pt-10">
          <div className="flex">
            <SideMenu />
          </div>
          <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-left">
            {hashtagParam}
            {/* <div className="flex flex-wrap justify-center w-full mx-2 p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
              <h1 className="w-full text-3xl text-bold mb-4">
                {postData.title}
              </h1>
              {postData.image && (
                <Image
                  src={postData.image}
                  alt={postData.title}
                  width={1920}
                  height={1080}
                />
              )}
              <div
                className="text-left w-full prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
              />
            </div> */}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}
