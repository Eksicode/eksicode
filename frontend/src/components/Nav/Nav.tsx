"use client";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineEdit,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import UserMenu from "@/components/Nav/UserMenu";
import TelegramGroups from "@/components/TelegramGroups";
import Search from "@/components/Search/Search";
import Navlink from "@/components/Ui/NavLink";
import MobileMenu from "@/components/Nav/MobileMenu";
import ThemeSwitch from "@/components/Nav/ThemeSwitch";
import Notifications from "@/components/Nav/Notifications";
import { RoleBasedLink } from "@/components/Auth/RoleBasedComponents";
import { useAuth } from "@/hooks/useAuth";

const Nav = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <nav className="flex flex-wrap w-full justify-center z-50 sticky top-0 nav-sahdow bg-white dark:bg-DarkerGrey">
      {/* Menu */}
      {/* <div className="flex items-center sm:basis-full md:basis-full lg:basis-full basis-3/4 h-16 mx-10 sm:mx-4 justify-between"> */}
      <div className="flex justify-between items-center h-16 md:mx-10 mx-2 basis-full md:basis-3/4 ">
        {/* Logo */}
        <div className="flex items-center">
          <Link className="flex content-center" href="/">
            <Image
              src={"/images/eksi-code-logo.png"}
              alt="eksi-code-logo"
              width="53"
              height="30"
            ></Image>
          </Link>
        </div>

        <div className="flex justify-center lg:w-1/4 w-1/2">
          <Search />
        </div>

        <div className="flex items-center justify-end">
          {/*  Desktop menu */}
          <div className="flex flex-nowrap items-center text-center text-sm">
            {/*  Theme Switcher */}
            <div className="mr-4 mt-1 hidden lg:block">
              <ThemeSwitch />
            </div>

            {!isAuthenticated && (
              <>
                <Navlink
                  variant="quaternary"
                  style="ml-3 pt-2 border border-white hidden lg:flex"
                  href="/auth/uye-giris"
                >
                  <div className="flex items-center">
                    <AiOutlineLogin className="h-5 w-5 mr-1" />{" "}
                    <span> Üye Girişi</span>
                  </div>
                </Navlink>
                <Navlink
                  variant="primary"
                  style="ml-3 hidden lg:flex"
                  href="/auth/uye-ol"
                >
                  <div className="flex items-center">
                    <AiOutlineUserAdd className="h-5 w-5 mr-1" />{" "}
                    <span className="">Üye Ol</span>
                  </div>
                </Navlink>
              </>
            )}

            {isAuthenticated && (
              <>
                <Navlink
                  variant="secondary"
                  href={isAdmin ? "/admin/posts/yeni" : "/profile/posts/yeni"}
                  style="hidden lg:flex"
                >
                  <div className="flex items-center">
                    <AiOutlineEdit className="h-5 w-5 mr-1" />
                    <span className="hidden lg:flex">Yeni Gönderi</span>
                  </div>
                </Navlink>
                <Notifications />
                <UserMenu />
              </>
            )}
          </div>
          {
            !isAuthenticated && (
              <>
                <Navlink
                  variant="quaternary"
                  style="ml-3 pt-2 border border-white flex lg:hidden"
                  href="/auth/uye-giris"
                >
                  <div className="flex items-center">
                    <AiOutlineLogin className="h-5 w-5 mr-1" />{" "}
                  </div>
                </Navlink>
                <Navlink
                  variant="primary"
                  style="ml-3 flex lg:hidden"
                  href="/auth/uye-ol"
                >
                  <div className="flex items-center">
                    <AiOutlineUserAdd className="h-5 w-5 mr-1" />
                  </div>
                </Navlink>
              </>
            )
          }
          <MobileMenu />
        </div>
      </div>
      <hr className="h-1 w-full border-t dark:border-DarkLightGrey" />

      <TelegramGroups />
    </nav>
  );
};

export default Nav;
