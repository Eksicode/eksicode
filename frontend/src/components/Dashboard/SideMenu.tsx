"use client";
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
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

interface MenuItem {
  icon: React.ComponentType;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    icon: MdDashboard,
    label: "Dashboard",
    path: "/dashboard"
  },
  {
    icon: AiOutlineUnorderedList,
    label: "Posts",
    path: "/dashboard/posts"
  },
];

const adminMenuItems: MenuItem[] = [
  {
    icon: FaUsers,
    label: "Users",
    path: "/dashboard/users"
  },
  {
    icon: RiPagesLine,
    label: "Pages",
    path: "/dashboard/pages"
  },
  {
    icon: BsMenuButtonWideFill,
    label: "Menu",
    path: "/dashboard/menu"
  },
];

const settingsMenuItem: MenuItem = {
  icon: AiFillSetting,
  label: "Ayarlar",
  path: "/dashboard/ayarlar"
};

const SideMenu = () => {
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && 
    session?.user?.roles?.includes("admin") || 
    session?.user?.roles?.includes("superadmin");

  useEffect(() => {
    if (status === "authenticated") {
      console.log("isAdmin", isAdmin);
      console.log("session", session);
      console.log("status", status);
    }
  }, [session, status, isAdmin]);

  const loadingItems = Array(6).fill(null).map((_, index) => ({
    id: `loading-${index}`,
    className: "h-4 bg-gray-200 rounded dark:bg-gray-700"
  }));

  if (status === "loading") {
    return (
      <aside className="w-64 hidden lg:block" aria-label="Sidebar">
        <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border text-gray-900 dark:text-white dark:bg-DarkerGrey dark:border-DarkLightGrey">
          <div className="animate-pulse space-y-4">
            {loadingItems.map((item) => (
              <div key={item.id} className={item.className}></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const renderMenuItem = ({ icon: Icon, label, path }: MenuItem) => (
    <li key={path}>
      <Link
        href={path}
        className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey"
      >
        <Icon  />
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
      </Link>
    </li>
  );

  return (
    <aside className="w-64 hidden lg:block" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border text-gray-900 dark:text-white dark:bg-DarkerGrey dark:border-DarkLightGrey">
        <ul className="space-y-2">
          {menuItems.map(renderMenuItem)}
          {isAdmin && adminMenuItems.map(renderMenuItem)}
          {renderMenuItem(settingsMenuItem)}
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;
