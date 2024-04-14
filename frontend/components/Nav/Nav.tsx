"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineEdit,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import Logo from "@public/assets/eksi-code-logo.png";
import UserMenu from "@components/Nav/UserMenu";
import TelegramGroups from "@components/TelegramGroups";
import Search from "@components/Search";
import Navlink from "@components/Ui/NavLink";
import MobileMenu from "./MobileMenu";

const Nav = () => {
  return (
    <nav className="flex flex-wrap w-full justify-center z-10  sticky top-0 nav-sahdow bg-white">
      {/* Menu */}
      {/* <div className="flex items-center sm:basis-full md:basis-full lg:basis-full basis-3/4 h-16 mx-10 sm:mx-4 justify-between"> */}
      <div className="flex justify-between items-center h-16 mx-10 sm:mx-2 sm:basis-full md:basis-full lg:basis-full basis-3/4 ">
        {/* Logo */}
        <div className="flex items-center">
          <Link className="flex content-center" href="/">
            <Image
              src={Logo}
              alt="eksi-code-logo"
              width="53"
              height="30"
            ></Image>
          </Link>
        </div>

        <div className="flex justify-center w-1/4 sm:w-1/2">
          <Search text="Başlık Ara..." />
        </div>

        <div className="flex items-center justify-end">
          {/*  Desktop menu */}
          <div className="flex flex-nowrap text-center md:text-sm lg:text-sm">
            <Navlink
              variant="secondary"
              href="/dashboard/posts/yeni"
              clasName="sm:hidden"
            >
              <div className="flex items-center">
                <AiOutlineEdit className="h-5 w-5 mr-1" />
                <span className="sm:hidden flex">Yeni Gönderi</span>
              </div>
            </Navlink>
            <Link href="/dashboard/posts/yeni">
              <AiOutlineEdit className="hidden sm:flex h-5 w-5 mr-2" />
            </Link>
            <Navlink
              variant="quaternary"
              clasName="ml-3 pt-2 border border-white sm:hidden"
              href="/auth/uye-giris"
            >
              <div className="flex items-center">
                <AiOutlineLogin className="h-5 w-5 mr-1" />{" "}
                <span> Üye Girişi</span>
              </div>
            </Navlink>
            <Navlink
              variant="primary"
              clasName="ml-3 sm:hidden"
              href="/auth/uye-ol"
            >
              <div className="flex items-center">
                <AiOutlineUserAdd className="h-5 w-5 mr-1" />{" "}
                <span className="">Üye Ol</span>
              </div>
            </Navlink>

            <Link
              className="inline-block relative mx-1"
              href="/dashboard/bildirimler"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="sm:h-6 sm:w-6 h-8 w-8 hover:text-eksiCode text-dark text-4xl"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-green-800 bg-eksiCode"></span>
            </Link>

            <UserMenu />
          </div>
          <MobileMenu />
        </div>
      </div>
      <hr className="h-1 w-full" />

      <TelegramGroups />
    </nav>
  );
};

export default Nav;
