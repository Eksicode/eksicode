// Remove 'use client' as this will be a server component
import React from "react";
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

// Mark the component as async to fetch data
async function SideMenu() {
  // Add cache configuration to disable caching
  const fetchMenu = async () => {
    try {
      // const fetchedMenu = await getData("menus", true, 0, 0, 0, { cache: "no-cache" });
      const fetchedMenu = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menus?summaryOnly=true&limit=0&page=0&pageSize=0`,
        {
          cache: "no-cache",
        }
      )
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error fetching menu:", error);
          throw new Error("Menu yüklenirken bir hata oluştu");
        });

      return fetchedMenu.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        link: item.link,
        subMenu: item.subMenu,
      }));
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw new Error("Menu yüklenirken bir hata oluştu");
    }
  };

  // Error boundaries will handle errors in production
  let menu: Menu[] = [];
  try {
    menu = await fetchMenu();
  } catch (error) {
    return (
      <aside className="w-64 sm:hidden" aria-label="Sidebar">
        <div className="overflow-y-auto w-64 py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
          <span className="text-sm font-semibold text-gray-500">
            Menu yüklenirken bir hata oluştu
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 sm:hidden" aria-label="Sidebar">
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
