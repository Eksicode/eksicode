import React from "react";
import Image from "@node_modules/next/image";
import SideMenu from "@components/Nav/SideMenu";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
interface PageData {
  page: string;
  title: string;
  image?: string;
  content: string;
}
interface PageProps {
  params: {
    page: string;
  };
}
const Page: React.FC<PageProps> = async ({ params }) => {
  const { page } = params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pages/${page}`,
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
                width={1920} // 1920px
                height={1080} // 1080px
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: pageData.content }}></div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
  }
};

export default Page;
