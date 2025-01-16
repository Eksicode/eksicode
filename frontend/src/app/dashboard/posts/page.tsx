import React from "react";
import DataTable from "@/components/Ui/DataTable";
import getData from "@/utils/getData";
import Navlink from "@/components/Ui/NavLink";

async function DashboardPosts() {
  const postsData = await getData("posts", true, 10);

  const preparedData = postsData.data.map((post) => ({
    id: post.id,
    title: post.title,
    status: post.status === true ? "Published" : "Draft",
  }));

  return (
    <>
      <div className="flex justify-between w-full items-center mb-5">
        <div>
          <h1 className="mt-2 w-full">Posts</h1>
        </div>
        <div>
          <Navlink href="/dashboard/sayfalar/yeni" variant="primary">
            + Yeni Post
          </Navlink>
        </div>
      </div>
      <DataTable
        data={preparedData}
        onView={true}
        onEdit={true}
        onDelete={true}
      />
    </>
  );
}

export default DashboardPosts;
