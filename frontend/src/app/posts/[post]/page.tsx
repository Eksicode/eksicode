import React from 'react';
import Link from 'next/link';
import SideMenu from '@/components/Nav/SideMenu';

function Page() {
  return (
    <>
      <div className="flex basis-3/4 pt-10">
        <div className="flex">
          <SideMenu />
        </div>
        <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-center">
          <div className="flex flex-wrap justify-center w-full mx-2 p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
            <h1 className="w-full text-3xl text-bold mb-4">İletişim</h1>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;