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
import getData from "@/utils/getData";
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
    label: "Kullanicilar",
    path: "/dashboard/kullanicilar"
  },
  {
    icon: RiPagesLine,
    label: "Sayfalar",
    path: "/dashboard/sayfalar"
  },
  {
    icon: FaShareNodes,
    label: "Roller",
    path: "/dashboard/roller"
  },
  {
    icon: AiOutlineTag,
    label: "Etiketler",
    path: "/dashboard/etiketler"
  },
  {
    icon: GrResources,
    label: "Kaynaklar",
    path: "/dashboard/kaynaklar"
  },
  {
    icon: MdOutlineWorkOutline,
    label: "Kariyer",
    path: "/dashboard/kariyer"
  },
  {
    icon: BsMenuButtonWideFill,
    label: "Menu",
    path: "/dashboard/menuler"
  },
];

const settingsMenuItem: MenuItem = {
  icon: AiFillSetting,
  label: "Ayarlar",
  path: "/dashboard/ayarlar"
};

const SideMenu = () => {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);


    useEffect(() => {
    if (status === "authenticated") {
      const adminStatus = session?.user?.roles?.includes("superadmin") ?? false;
      setIsAdmin(adminStatus);
      console.log("isAdmin", adminStatus);
      console.log("session", session);
      console.log("status", status);
    }
  }, [session, status]);


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

  const menuList = [...menuItems];
  if (isAdmin) {
    menuList.push(...adminMenuItems);
  }
  menuList.push(settingsMenuItem);

  const renderMenuItem = ({ icon: Icon, label, path }: MenuItem) => (
    <li key={path}>
      <Link
        href={path}
        className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey"
      >
        <Icon />
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
      </Link>
    </li>
  );

  return (
    <aside className="w-64 hidden lg:block" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border text-gray-900 dark:text-white dark:bg-DarkerGrey dark:border-DarkLightGrey">
        <ul className="space-y-2">
          {menuList.map(renderMenuItem)}
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;