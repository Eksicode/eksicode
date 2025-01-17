import React from "react";
import Image from "next/image";
import SideMenu from "@components/Nav/SideMenu";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

interface PageData {
  page: string;
  title: string;
  image?: string;
  content: string;
}

// Remove custom Props type and use the correct parameter typing
export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  return {
    title: `${params.page} - EksiCode`,
  }
}

// Use the correct parameter typing for the page component
export default async function Page({
  params,
}: {
  params: { page: string };
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pages/${params.page}`,
      { cache: "force-cache" }
    );

    if (response.status === 404) {
      notFound();
    }

    const pageData: PageData = await response.json();

    return (
      <>
        <div className="flex">
          <SideMenu />
        </div>
        <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-left">
          <div className="flex flex-wrap justify-center w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
            <h1 className="w-full text-3xl text-bold mb-4 text-center">
              {pageData.title}
            </h1>
            {pageData.image && (
              <Image
                src={pageData.image}
                alt={pageData.title}
                width={1920}
                height={1080}
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: pageData.content }}></div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}