import React from "react";
import Link from "next/link";
import SideMenu from "@components/Dashboard/SideMenu";
import NextBreadcrumb from "@/components/NextBreadcrumb";
import DataTable from "@components/Ui/DataTable";
import PagePost from "@components/Dashboard/PagePost";
import Navlink from "@components/Ui/NavLink";

function DashboardPages() {
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

        <div className="nowrap w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
          <div className="flex justify-between flex-nowrap basis-full text-xl text-bold mb-4">
            <h1 className="mt-2">Sayfalar</h1>
            <Navlink clasName="" href="/dashboard/sayfalar/yeni-sayfa">
              + Yeni Sayfa
            </Navlink>
          </div>

          <DataTable />
        </div>
      </div>
    </>
  );
}

export default DashboardPages;
