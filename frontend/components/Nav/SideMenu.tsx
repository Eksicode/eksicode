import React from "react";
import * as md from "react-icons/md";
import * as Ai from "react-icons/ai";
import Link from "next/link";
import getData from "@providers/getData";

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

async function SideMenu() {
  // Fetch data directly in the server component
  let menu: Menu[] = [];
  try {
    const fetchedMenu = await getData("menus", true);
    menu = fetchedMenu.data.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      link: item.link,
      subMenu: item.subMenu,
    })) as Menu[];
  } catch (error) {
    console.error("Error fetching telegram groups:", error);
  }

  return (
    <aside className="w-64 sm:hidden" aria-label="Sidebar">
      <div className="overflow-y-auto w-64 py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border fixed">
        <ul className="space-y-2">
          {menu && menu.length < 0 && (
            <span className="text-sm font-semibold text-gray-500">
              Hata oluştu
            </span>
          )}
          {menu.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
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
