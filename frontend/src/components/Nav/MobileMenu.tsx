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
  adminLink?: string;
  adminOnly?: boolean;
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
  { name: "Dashboard", icon: "MdDashboard", link: "/profile", adminLink: "/admin" },
  { name: "Sayfalar", icon: "RiPagesLine", link: "/profile/sayfalar", adminLink: "/admin/sayfalar" },
  { name: "Kullanıcılar", icon: "FaUsers", link: "/profile/kullanicilar", adminLink: "/admin/kullanicilar", adminOnly: true },
  { name: "Posts", icon: "AiOutlineUnorderedList", link: "/profile/posts", adminLink: "/admin/posts" },
  { name: "Roller", icon: "FaShareNodes", link: "/profile/roller", adminLink: "/admin/roller", adminOnly: true },
  { name: "Menüler", icon: "BsMenuButtonWideFill", link: "/profile/menuler", adminLink: "/admin/menuler", adminOnly: true },
  { name: "Etiketler", icon: "AiOutlineTag", link: "/profile/etiketler", adminLink: "/admin/etiketler" },
  { name: "Kaynaklar", icon: "GrResources", link: "/profile/kaynaklar", adminLink: "/admin/kaynaklar" },
  { name: "Kariyer", icon: "MdOutlineWorkOutline", link: "/profile/kariyer", adminLink: "/admin/kariyer" },
  { name: "Ayarlar", icon: "AiFillSetting", link: "/profile/ayarlar", adminLink: "/admin/ayarlar" },
];

const getIconComponent = (iconName: string): React.ComponentType | null => {
  return IconMap[iconName as keyof typeof IconMap] || null;
};

const MobileMenu = () => {
  const { user: authUser, isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [nav, setNav] = useState(false);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize activeTab based on authentication status and pathname
  const [activeTab, setActiveTab] = useState<"sayfalar" | "dashboard">(() => {
    if (!isAuthenticated) return "sayfalar";
    return pathname.startsWith("/admin") || pathname.startsWith("/profile") ? "dashboard" : "sayfalar";
  });

  // Update activeTab when authentication state changes
  useEffect(() => {
    if (!isAuthenticated && activeTab === "dashboard") {
      setActiveTab("sayfalar");
    }
  }, [isAuthenticated, activeTab]);

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

  const currentMenu = activeTab === "sayfalar" ? menu : dashboardMenuItem.filter(item => 
    !item.adminOnly || isAdmin
  );

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

          {/* Tab Navigation - Only show dashboard tab if user is authenticated */}
          <div className="mx-5 flex justify-center border-b-2 gap-3 pb-1 mt-4">
            {isAuthenticated ? (
              <>
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
                  {isAdmin ? 'Admin' : 'Profil'}
                </button>
              </>
            ) : (
              ""
            )}
          </div>
          
          {/* Menu List */}
          <div className="flex flex-col mt-2 mx-5 z-20 h-[350px] overflow-auto text-ellipsis">
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
                  
                  // Determine the correct link based on user role for dashboard items
                  const itemLink = activeTab === "dashboard" && (item as any).adminLink && isAdmin 
                    ? (item as any).adminLink 
                    : item.link;
                  
                  const isActive = pathname === itemLink;

                  return (
                    <li key={index}>
                      <Link
                        onClick={handleNav}
                        href={itemLink}
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
