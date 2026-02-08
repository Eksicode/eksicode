"use client";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineEdit,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineSearch,
} from "react-icons/ai";
import UserMenu from "@/components/Nav/UserMenu";
import TelegramGroups from "@/components/TelegramGroups";
import Search from "@/components/Search/Search";
import Navlink from "@/components/Ui/NavLink";
import MobileMenu from "@/components/Nav/MobileMenu";
import ThemeSwitch from "@/components/Nav/ThemeSwitch";
import Notifications from "@/components/Nav/Notifications";
import { useAuth } from "@/hooks/useAuth";

const Nav = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize auth state to prevent unnecessary re-renders
  const authState = useMemo(() => ({
    isAuthenticated,
    isLoading
  }), [isAuthenticated, isLoading]);

  const showAuth = mounted && !authState.isLoading;

  return (
    <nav className="flex flex-wrap w-full justify-center z-50 sticky top-0 nav-shadow bg-white dark:bg-DarkerGrey">
      <div className="flex justify-between items-center h-16 md:mx-10 mx-2 basis-full md:basis-3/4">
        {/* Logo */}
        <div className="flex items-center">
          <Link className="flex content-center" href="/" aria-label="Ana Sayfa">
            <Image
              src={"/images/eksi-code-logo.png"}
              alt="ekşi Code logo"
              width="53"
              height="30"
              priority
              onError={(e) => {
                console.error("Failed to load logo image");
                // Fallback to text if image fails
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-xl ml-2 font-bold text-gradient bg-gradient-to-r from-eksiCodeMedium to-eksiCode bg-clip-text text-transparent" aria-label="EkşiCode">
              EkşiCode
            </span>
          </Link>
        </div>

        <div className="hidden md:flex justify-center lg:w-1/4 w-1/2">
          <Search />
        </div>


        <div className="flex items-center justify-end">
          {/* Desktop menu */}
          <div className="flex flex-nowrap items-center text-center text-sm">
            {/* Theme Switcher */}
            <div className="mr-4 mt-1 hidden lg:block">
              <ThemeSwitch />
            </div>
            <div className="flex md:hidden items-center ">
          <Link href="/arama" aria-label="Arama">
            <AiOutlineSearch className="h-6 w-6" />
          </Link>
        </div>

            {showAuth && !authState.isAuthenticated && (
              <>
                <Navlink
                  variant="quaternary"
                  style="ml-3 pt-2 border border-white hidden lg:flex"
                  href="/auth/uye-giris"
                >
                  <div className="flex items-center">
                    <AiOutlineLogin className="h-5 w-5 mr-1" aria-hidden="true" />
                    <span> Üye Girişi</span>
                  </div>
                </Navlink>

              </>
            )}

            {showAuth && authState.isAuthenticated && (
              <>
                <Navlink
                  variant="secondary"
                  href="/profile/posts/create"
                  style="hidden lg:flex"
                >
                  <div className="flex items-center">
                    <AiOutlineEdit className="h-5 w-5 mr-1" aria-hidden="true" />
                    <span className="hidden lg:flex">Yeni Gönderi</span>
                  </div>
                </Navlink>
                <Notifications />
                <UserMenu />
              </>
            )}
          </div>
          {showAuth && !authState.isAuthenticated && (
            <>
              <Navlink
                variant="quaternary"
                style="ml-3 pt-2 border border-white flex lg:hidden"
                href="/auth/uye-giris"
              >
                <div className="flex items-center">
                  <AiOutlineLogin className="h-5 w-5 mr-1" aria-hidden="true" />
                </div>
              </Navlink>

            </>
          )}
          <MobileMenu />
        </div>
      </div>
      <hr className="h-1 w-full border-t dark:border-DarkLightGrey" />

      <TelegramGroups />
    </nav>
  );
};

export default Nav;
