"use client";
import {
  AiOutlineUnorderedList,
  AiOutlineTag,
  AiFillSetting,
} from "react-icons/ai";
import { MdOutlineWorkOutline, MdDashboard } from "react-icons/md";
import { GrResources } from "react-icons/gr";
import { RiPagesLine } from "react-icons/ri";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";

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
  {
    icon: AiOutlineUnorderedList,
    label: "favoriler",
    path: "/dashboard/favoriler"
  },
  {
    icon: RiPagesLine,
    label: "Sayfalar",
    path: "/dashboard/sayfalar"
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
    icon: AiFillSetting,
    label: "Ayarlar",
    path: "/dashboard/ayarlar"
  }
];

const SideMenu = () => {
  const { user, token, isLoading } = useAuth();
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token && user?.id) {
        try {
          const userInfo = await authService.getCurrentUser(token);
          if (userInfo) {
            setUserDetails(userInfo);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [token, user?.id]);

  const loadingItems = Array(6).fill(null).map((_, index) => ({
    id: `loading-${index}`,
    className: "h-4 bg-gray-200 rounded dark:bg-gray-700"
  }));

  if (isLoading || !userDetails) {
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
        <Icon />
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
      </Link>
    </li>
  );

  return (
    <aside className="w-64 hidden lg:block" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border text-gray-900 dark:text-white dark:bg-DarkerGrey dark:border-DarkLightGrey">
        <ul className="space-y-2">
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;