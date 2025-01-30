import React from "react";
import Link from "next/link";
import SideMenu from "@/components/Nav/SideMenu";

function page() {
  return (
    <>
      <div className="flex basis-3/4 py-5">
        <div className="flex">
          <SideMenu />
        </div>
        <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-center">
          <div className="flex flex-wrap justify-center w-full mx-2 p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
            <h1 className="w-full text-3xl text-bold mb-4">Künye</h1>
            <p className="w-full my-2">
              Düşünen & kodlayan:
              <Link
                href="https://github.com/mkltkn"
                target="_blank"
                className="hover:underline ml-1"
              >
                mkltkn
              </Link>
            </p>
            <p className="w-full my-2">
              kodlayan:
              <Link
                href="https://github.com/MuharremGonel"
                target="_blank"
                className="hover:underline ml-1"
              >
                 MuharremGonel
              </Link>
            </p>
            <p className="w-full my-2">
              kodlayan:
              <Link
                href="https://github.com/hasanbelen35"
                target="_blank"
                className="hover:underline ml-1"
              >
                hasanbelen35
              </Link>
            </p>

            <p className="w-full my-2">
              kodlayan:
              <Link
                href="https://github.com/dgkdev"
                target="_blank"
                className="hover:underline ml-1"
              >
                dgkdev
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
