import { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import * as md from "react-icons/md";
import * as Ai from "react-icons/ai";
import Link from "next/link";
import getData from "@/utils/getData";
import { usePathname } from "next/navigation";

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

const MobileMenu = () => {
  const [nav, setNav] = useState(false);
  const [menu, setMenu] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const fetchedMenu = await getData("menus", true, 0, 0, 0, { cache: "no-cache" });
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

  return (
    <>
      {/*  Hamburger Menu Icon */}
      <div onClick={handleNav} className="sm:block hidden cursor-pointer">
        <AiOutlineMenu size={25} className="m-1 text-dark dark:text-gray-300" />
      </div>
      {/*  Mobile menu */}
      <div
        className={
          nav ? "block z-50" : "hidden"
        }
      >
        <div
          className={`fixed md:hidden top-0 z-50 right-0 bottom-0 min-h-screen h-full w-64 bg-white dark:bg-DarkGrey shadow-lg transform ${nav ? "translate-x-0" : "-translate-x-full"
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

          {/*  Mobile Menu */}
          <div className="flex flex-col mt-5 mx-5 py-4 z-20">
            <ul className="space-y-2">
              {error && (
                <span className="text-sm font-semibold text-gray-500">
                  {error}
                </span>
              )}
              {!error && menu.length === 0 && (
                <span className="text-sm font-semibold text-gray-500">
                  Menü bulunamadı
                </span>
              )}
              {!error &&
                menu.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  const isActive = pathname === item.link;
                  return (
                    <li key={item.id}>
                      <Link
                        onClick={handleNav}
                        href={item.link}
                        className={`${isActive ? " text-eksiCode" : ""} flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey`}
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
            <div className="flex items-center text-white justify-center my-10 gap-2">
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
      </div>
      <div
        className={`fixed md:hidden inset-0 h-screen overflow-y-hidden bg-black bg-opacity-50 z-40 ${nav ? "block" : "hidden"
          } transition-opacity duration-300 ease-in-out`}
        onClick={handleNav}
      ></div>
    </>
  );
};

export default MobileMenu;
