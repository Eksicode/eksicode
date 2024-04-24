import React from "react";
import Link from "next/link";
import SideMenu from "@components/Dashboard/SideMenu";
import NextBreadcrumb from "@/components/NextBreadcrumb";
import PagePost from "@components/Dashboard/PagePost";

function DashboardPages() {
  return (
    <>
      <div className="flex flex-wrap basis-full">
        <div className="flex justify-between flex-nowrap basis-full text-xl text-bold mb-4">
          <h1 className="mt-2">Yeni Sayfa Ekle</h1>
        </div>

        <PagePost />
      </div>
    </>
  );
}

export default DashboardPages;
