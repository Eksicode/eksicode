'use client';
import React, { useState, useEffect } from "react";
import * as md from "react-icons/md";
import * as Ai from "react-icons/ai";
import Link from "next/link";
// import getData from "@/utils/getData";

interface Menu {
  id: number;
  name: string;
  link: string;
  subMenu: number;
  icon: string;
}

const IconMap = {
  ...md,
  ...Ai,
};

const getIconComponent = (iconName: string): React.ComponentType | null => {
  const IconComponent = IconMap[iconName as keyof typeof IconMap];
  return IconComponent || null;
};

function SideMenu() {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // const fetchedMenu = await getData("menus", true, 0, 0, 0, { cache: "no-cache" });
        const fetchedMenu = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menus?summaryOnly=true`
        )
          .then((res) => res.json())
          .catch((error) => {
            console.error("Error fetching menu:", error);
            throw new Error("Menu yüklenirken bir hata oluştu");
          });

        const menuData = fetchedMenu.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          link: item.link,
          subMenu: item.subMenu,
        }));
        
        setMenu(menuData);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError("Menu yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <aside className="w-64 hidden lg:block" aria-label="Sidebar">
        <div className="overflow-y-auto w-64 py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
          <span className="text-sm font-semibold text-gray-500">
            Menü yükleniyor...
          </span>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 hidden lg:block" aria-label="Sidebar">
        <div className="overflow-y-auto w-64 py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
          <span className="text-sm font-semibold text-gray-500">
            {error}
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 hidden lg:block" aria-label="Sidebar">
      <div className="overflow-y-auto min-h-96 w-64 py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
        <ul className="space-y-2">
          {menu.length === 0 && (
            <span className="text-sm font-semibold text-gray-500">
              Menü bulunamadı
            </span>
          )}
          {menu.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey"
                >
                  {IconComponent && (
                    <IconComponent
                      className="text-lg"
                      {...(IconComponent as any)}
                    />
                  )}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default SideMenu;
