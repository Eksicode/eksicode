import React from "react";
import Link from "next/link";
import SideMenu from "@components/Nav/SideMenu";
import DataTable from "@components/Ui/DataTable";

interface sources {
  id: number;
  name: string;
  slug: string;
  postCount: number;
  icon: string;
  description: string;
}

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
  const sources = await getData();

  // const preparedData = tagsData.map((tag) => ({
  //   name: tag.name,
  // }));

  return (
    <>
      <div className="flex w-1/3">
        <SideMenu />
      </div>

      <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-left">
        <div className="flex flex-wrap justify-center w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
          <h1 className="flex basis-1/2 text-3xl text-bold text-left">
            Kaynaklar
          </h1>
          {/* <DataTable
        data={preparedData}
        onView={true}
        onEdit={true}
        onDelete={true}
      /> */}
        </div>
      </div>
    </>
  );
}
