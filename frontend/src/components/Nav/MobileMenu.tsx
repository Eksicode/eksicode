"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import * as md from "react-icons/md";
import * as Ai from "react-icons/ai";
import * as Ri from "react-icons/ri";
import * as Fa from "react-icons/fa";
import * as Fa6 from "react-icons/fa6";
import * as Bs from "react-icons/bs";
import * as Gr from "react-icons/gr";
import React from "react";
import Link from "next/link";
import getData from "@/utils/getData";
import { usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";
import { useAuth } from "@/hooks/useAuth";

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for menu data
let menuCache: { data: Menu[]; timestamp: number } | null = null;

interface Menu {
  id?: number;
  name: string;
  link: string;
  subMenu?: number;
  icon: string;
  adminLink?: string;
  adminOnly?: boolean;
}

interface DashboardMenuItem {
  name: string;
  icon: string;
  link: string;
  adminLink: string;
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

const dashboardMenuItem: DashboardMenuItem[] = [
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

const getIconComponent = (iconName: string): React.ComponentType<{ className?: string }> | null => {
  const IconComponent = IconMap[iconName as keyof typeof IconMap];
  return IconComponent || null;
};

const MobileMenu = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const [nav, setNav] = useState(false);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    if (!menuCache) return false;
    return Date.now() - menuCache.timestamp < CACHE_DURATION;
  }, []);

  const fetchMenuWithRetry = useCallback(async (attempt = 1): Promise<void> => {
    try {
      setError(null);
      
      // Use cached data if available and valid
      if (isCacheValid() && menuCache) {
        setMenu(menuCache.data);
        setRetryCount(0);
        setLoading(false);
        return;
      }

      const fetchedMenu = await getData<Menu>("menus", true, 0, 0, 0, {
        cache: "no-cache",
      });

      // Validate response structure
      if (!fetchedMenu || !Array.isArray(fetchedMenu.data)) {
        throw new Error("Invalid response structure");
      }

      const menuData = fetchedMenu.data.map((item: Partial<Menu> & { id?: number; name?: string; link?: string; icon?: string; subMenu?: number }) => ({
        id: item.id,
        name: item.name || "İsimsiz Menü",
        icon: item.icon || "MdMenu", // Fallback icon
        link: item.link || "#",
        subMenu: item.subMenu || 0,
      }));
      
      // Update cache
      menuCache = {
        data: menuData,
        timestamp: Date.now()
      };
      
      setMenu(menuData);
      setRetryCount(0);
    } catch (error) {
      console.error(`Error fetching menu (attempt ${attempt}):`, error);
      
      if (attempt < RETRY_ATTEMPTS) {
        setRetryCount(attempt);
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        timeoutRef.current = setTimeout(() => {
          fetchMenuWithRetry(attempt + 1);
        }, delay);
      } else {
        setError("Menü yüklenirken bir hata oluştu. Sayfayı yenilemeyi deneyin.");
        setRetryCount(0);
      }
    }
  }, [isCacheValid]);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      await fetchMenuWithRetry();
    } finally {
      setLoading(false);
    }
  }, [fetchMenuWithRetry]);

  useEffect(() => {
    fetchMenu();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchMenu]);

  const handleRetry = useCallback(() => {
    // Clear cache on manual retry
    menuCache = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    fetchMenu();
  }, [fetchMenu]);

  const handleNav = useCallback(() => {
    try {
      setNav((prev) => {
        const newNav = !prev;
        if (typeof document !== "undefined") {
          document.body.style.overflow = newNav ? "hidden" : "auto";
        }
        return newNav;
      });
    } catch (error) {
      console.error("Error toggling navigation:", error);
    }
  }, []);

  const currentMenu: (Menu | DashboardMenuItem)[] = activeTab === "sayfalar" 
    ? menu 
    : dashboardMenuItem.filter(item => !item.adminOnly || isAdmin);

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
            {loading && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-2/3"></div>
                {retryCount > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Yeniden deneniyor... ({retryCount}/{RETRY_ATTEMPTS})
                  </div>
                )}
              </div>
            )}
            {!loading && error && (
              <div className="text-center py-4">
                <div className="text-red-500 mb-2">
                  <md.MdError className="text-2xl mx-auto" />
                </div>
                <span className="text-sm font-semibold text-gray-500 block mb-3">
                  {error}
                </span>
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  Tekrar Dene
                </button>
              </div>
            )}
            {!loading && !error && (
              <ul className="space-y-1">
                {currentMenu.length === 0 ? (
                  <li className="text-center py-4">
                    <span className="text-sm font-semibold text-gray-500">
                      Menü bulunamadı
                    </span>
                  </li>
                ) : (
                  currentMenu.map((item, index) => {
                    const isDashboardItem = activeTab === "dashboard" && "adminLink" in item;
                    const iconName = item.icon;
                    const IconComponent = getIconComponent(iconName);
                    
                    // Determine the correct link based on user role for dashboard items
                    const itemLink = isDashboardItem && item.adminLink && isAdmin 
                      ? item.adminLink 
                      : item.link;
                    
                    const isActive = pathname === itemLink;
                    const itemKey = "id" in item && item.id ? item.id : index;

                    return (
                      <li key={itemKey}>
                        <Link
                          onClick={handleNav}
                          href={itemLink}
                          className={`${isActive ? "text-eksiCode" : ""
                            } flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey transition-colors`}
                        >
                          {IconComponent ? (
                            React.createElement(IconComponent, {
                              className: "text-lg flex-shrink-0"
                            })
                          ) : (
                            <md.MdMenu className="text-lg flex-shrink-0" />
                          )}
                          <span className="ml-3 truncate">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
            )}
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
