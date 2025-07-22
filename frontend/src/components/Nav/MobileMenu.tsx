"use client";
import { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import * as md from "react-icons/md";
import * as Ai from "react-icons/ai";
import * as Ri from "react-icons/ri";
import * as Fa from "react-icons/fa";
import * as Fa6 from "react-icons/fa6";
import * as Bs from "react-icons/bs";
import * as Gr from "react-icons/gr";
import Link from "next/link";
import getData from "@/utils/getData";
import { usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";
import { useAuth } from "@/hooks/useAuth";

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
  ...Ri,
  ...Fa,
  ...Bs,
  ...Gr,
  ...Fa6,
};

const dashboardMenuItem = [
  { name: "Dashboard", icon: "MdDashboard", link: "/dashboard" },
  { name: "Sayfalar", icon: "RiPagesLine", link: "/dashboard/sayfalar" },
  { name: "Kullanıcılar", icon: "FaUsers", link: "/dashboard/kullanicilar" },
  { name: "Posts", icon: "AiOutlineUnorderedList", link: "/dashboard/posts" },
  { name: "Roller", icon: "FaShareNodes", link: "/dashboard/roller" },
  { name: "Menüler", icon: "BsMenuButtonWideFill", link: "/dashboard/menuler" },
  { name: "Etiketler", icon: "AiOutlineTag", link: "/dashboard/etiketler" },
  { name: "Kaynaklar", icon: "GrResources", link: "/dashboard/kaynaklar" },
  { name: "Kariyer", icon: "MdOutlineWorkOutline", link: "/dashboard/kariyer" },
  { name: "Ayarlar", icon: "AiFillSetting", link: "/dashboard/ayarlar" },
];

const getIconComponent = (iconName: string): React.ComponentType | null => {
  return IconMap[iconName as keyof typeof IconMap] || null;
};

const MobileMenu = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [nav, setNav] = useState(false);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sayfalar" | "dashboard">(() =>
    pathname.startsWith("/dashboard") ? "dashboard" : "sayfalar"
  );


  const handleNav = () => {
    setNav(!nav);
    if (!nav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const fetchedMenu = await getData("menus", true, 0, 0, 0, {
          cache: "no-cache",
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
        setError("Menü yüklenirken bir hata oluştu");
      }
    };

    fetchMenu();
  }, []);


  const currentMenu = activeTab === "sayfalar" ? menu : dashboardMenuItem;

  return (
    <>
      {/* Hamburger Menu Icon */}
      <div onClick={handleNav} className="block lg:hidden cursor-pointer">
        <AiOutlineMenu size={25} className="m-1 text-dark dark:text-gray-300" />
      </div>

      {/* Mobile menu */}
      <div className={nav ? "block z-50" : "hidden"}>
        <div
          className={`fixed lg:hidden top-0 z-50 right-0 bottom-0 min-h-screen h-full w-64 bg-white dark:bg-DarkGrey shadow-lg transform ${nav ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`}
        >
          <div className="flex w-full items-end justify-end">
            <div
              onClick={handleNav}
              className="rounded-full shadow-sm shadow-gray-400 p-2 mr-2 mt-3 cursor-pointer"
            >
              <AiOutlineClose />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mx-5 flex justify-center border-b-2 gap-3 pb-1">
            <button
              onClick={() => setActiveTab("sayfalar")}
              className={`px-4 py-2 rounded-md ${activeTab === "sayfalar"
                ? "bg-eksiCode/60 hover:bg-eksiCode transition duration-300 ease-in-out"
                : ""
                }`}
            >
              Sayfalar
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-md ${activeTab === "dashboard"
                ? "bg-eksiCode/60 hover:bg-eksiCode transition duration-300 ease-in-out"
                : ""
                }`}
            >
              Dashboard
            </button>
          </div>
          {/* Menu List */}
          <div className="flex flex-col mx-5 z-20 h-[350px] overflow-auto text-ellipsis">
            <ul className="space-y-1">
              {error && (
                <span className="text-sm font-semibold text-gray-500">
                  {error}
                </span>
              )}
              {!error && currentMenu.length === 0 && (
                <span className="text-sm font-semibold text-gray-500">
                  Menü bulunamadı
                </span>
              )}
              {!error &&
                currentMenu.map((item, index) => {
                  const IconComponent = getIconComponent(
                    activeTab === "sayfalar" ? item.icon : (item as any).icon
                  );
                  const isActive = pathname === item.link;

                  return (
                    <li key={index}>
                      <Link
                        onClick={handleNav}
                        href={item.link}
                        className={`${isActive ? " text-eksiCode" : ""
                          } flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey`}
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
          <div className="flex justify-center mt-2">
            <ThemeSwitch />
          </div>
          {/* Social Icons */}
          <div className="flex items-center text-white justify-center mt-5 gap-2">
            <div className="rounded-full shadow-lg bg-eksiCodeMedium p-3 cursor-pointer hover:scale-110 ease-in duration-300 text-eksi">
              <FaGithub />
            </div>
            <div className="rounded-full shadow-lg bg-eksiCodeMedium p-3 cursor-pointer hover:scale-110 ease-in duration-300 text-eksi">
              <FaTwitter />
            </div>
            <div className="rounded-full shadow-lg bg-eksiCodeMedium p-3 cursor-pointer hover:scale-110 ease-in duration-300 text-eksi">
              <FaDiscord />
            </div>
          </div>
        </div>
      </div>
      {/* Background Overlay */}
      <div
        className={`fixed lg:hidden inset-0 h-screen overflow-y-hidden bg-black bg-opacity-50 z-40 ${nav ? "block" : "hidden"
          } transition-opacity duration-300 ease-in-out`}
        onClick={handleNav}
      ></div>
    </>
  );
};

export default MobileMenu;
