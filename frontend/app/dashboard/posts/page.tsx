import React from "react";
import DataTable from "@components/Ui/DataTable";
import getPosts from "@providers/getPosts";

async function DashboardPosts() {
  const postsData = await getPosts("total", "no-store");

  const preparedData = postsData.map((post) => ({
    title: post.title,
    tags: post.tags?.map((tag) => tag || "").join(", "),
    status: post.status === true ? "Published" : "Draft",
  }));

  return (
    <>
      <h1 className="mt-2 w-full">Posts</h1>
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
