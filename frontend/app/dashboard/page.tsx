import React from "react";
import SideMenu from "@components/Dashboard/SideMenu";
import NextBreadcrumb from "@/components/NextBreadcrumb";

function Dahboard() {
  return (
    // <div className="flex w-full justify-center pt-5 pb-5 font-eksifont bg-eksiContent">
    // <div className="flex basis-3/4">
    <>
      <div className="basis-1/4">
        <SideMenu />
      </div>

      <div className="flex flex-wrap basis-full">
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
            <h1 className="mt-2">Dashboard</h1>
          </div>
        </div>
      </div>
    </>
    // </div>
    // </div>
  );
}

export default Dahboard;
