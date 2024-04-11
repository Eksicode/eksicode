import React from "react";
import SideMenu from "@components/Dashboard/SideMenu";
import NextBreadcrumb from "@/components/NextBreadcrumb";
import DataTable from "@components/Ui/DataTable";
import getPosts from "@providers/getPosts";

async function DashboardPosts() {
  const postsData = await getPosts("total", "no-store");

  const preparedData = postsData.map((post) => ({
    title: post.title,
    tags: post.tags,
    status: post.status === true ? "Published" : "Draft",
    view: true,
    delete: true,
    edit: false,
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
        <DataTable data={preparedData as DataTableProps[]} />
      </div>
    </>
  );
}

export default DashboardPosts;
