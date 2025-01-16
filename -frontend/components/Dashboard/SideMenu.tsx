import {
  AiOutlineUnorderedList,
  AiOutlineVideoCamera,
  AiOutlineTag,
  AiFillSetting,
} from "react-icons/ai";
import { MdOutlineWorkOutline, MdDashboard } from "react-icons/md";
import { GrResources } from "react-icons/gr";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { RiPagesLine } from "react-icons/ri";
import { FaShareNodes } from "react-icons/fa6";

import Link from "next/link";
import React from "react";

const SideMenu = () => {
  return (
    <aside className="w-64 sm:hidden" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <MdDashboard className="text-lg mb-1" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/sayfalar"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <RiPagesLine className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Sayfalar</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/kullanicilar"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <FaUsers className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">
                Kullanıcılar
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/posts"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 "
            >
              <AiOutlineUnorderedList className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Posts</span>
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/roller"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <FaShareNodes className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Roller</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/menuler"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <BsMenuButtonWideFill className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Menüler</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/etiketler"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <AiOutlineTag className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Etiketler</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/kaynaklar"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <GrResources className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Kaynaklar</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/kariyer"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <MdOutlineWorkOutline className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Kariyer</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/ayarlar"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <AiFillSetting className="text-lg mb-1" />
              <span className="flex-1 ml-3 whitespace-nowrap">Ayarlar</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;
