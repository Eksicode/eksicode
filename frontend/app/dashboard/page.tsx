import React from 'react';
import SideMenu from '@components/Dashboard/SideMenu';
import NextBreadcrumb from '@/components/NextBreadcrumb';

function Dahboard() {
  return (
    <div className="flex w-full justify-center pt-5 pb-5 font-eksifont bg-eksiContent">
      <div className="flex w-3/4">

        <div className="flex w-2/6">
          <SideMenu />
        </div>

        <div className="flex flex-wrap w-4/6 sm:w-full md:w-full">
          <NextBreadcrumb
            homeElement={'Anasayfa'}
            separator={<span> / </span>}
            activeClasses="text-gray-500"
            containerClasses="flex"
            listClasses="hover:underline mx-2"
            capitalizeLinks
          />
          <div className="flex flex-wrap justify-center w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
            <p className="w-full text-3xl text-bold mb-4">Telegram Grupları</p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dahboard;
