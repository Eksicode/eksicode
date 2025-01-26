import React from "react";
import Link from "next/link";
import SideMenu from "@/components/Nav/SideMenu";
import Image from "next/image";
import { IPost } from "@/types/types";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export default async function Post({ params }: { params: { post: string } }) {
  console.log("params:", params.post);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${params.post}`,
      {
        cache: "force-cache",
      }
    );
    if (response.status === 404) {
      notFound();
    }
    const postData: IPost = await response.json();

    console.log("postData:", postData)

    const sanitizedContent = DOMPurify.sanitize(postData.content);

    return (
      <>
        <div className="flex basis-3/4 pt-10">
          <div className="flex">
            <SideMenu />
          </div>
          <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-left">
            <div className="flex flex-wrap justify-center w-full mx-2 p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
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
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}
