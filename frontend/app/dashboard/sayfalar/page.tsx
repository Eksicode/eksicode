import React from "react";
import SideMenu from "@components/Dashboard/SideMenu";
import NextBreadcrumb from "@/components/NextBreadcrumb";
import DataTable from "@components/Ui/DataTable";
import getPages from "@providers/getPages";
interface Pages {
  title: string;
  post: string;
  tags: string[];
  slug: string;
  category_id: string;
  image: string;
  user_id: string;
  status: boolean;
}

async function DashboardPages() {
  const pagesData = await getPages("");

  const preparedData = pagesData.map((page) => ({
    title: page.title,
  }));


  return (
    <>
      <div className="basis-1/4">
        <SideMenu />
      </div>
      <div className="flex flex-wrap basis-full mb-6">
        <NextBreadcrumb
          homeElement={"Anasayfa"}
          separator={<span> / </span>}
          activeClasses="text-slate-700"
          containerClasses="flex"
          listClasses="hover:underline mx-2"
          capitalizeLinks
        />
        <DataTable data={preparedData}/>
      </div>
    </>
  );
}

export default DashboardPages;
