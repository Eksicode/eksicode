import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SideMenu from "./Nav/SideMenu";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { BiBookmarkAltPlus } from "react-icons/bi";
import Post from "@components/PostCard";
import Navlink from "@components/Ui/NavLink";
import Pagination from "@components/Ui/Pagination";

import ppImage from "../public/assets/pp-image.png";

const Page = () => {
  return (
    <>
      <div className="flex">
        <SideMenu />
      </div>

      <div className="flex flex-wrap w-7/12 sm:w-full md:w-full mx-2">
        <div className="flex mb-2 h-10 text-xs items-center">
          <Navlink variant="tertiary" href="/uye-ol">
            İlgili
          </Navlink>
          <Navlink variant="tertiary" clasName="ml-3" href="/uye-ol">
            En Yeniler
          </Navlink>
          <Navlink variant="tertiary" clasName="ml-3" href="/uye-ol">
            En Beğenilenler
          </Navlink>
        </div>

        <Post />

        <div className="py-4 w-full px-1 mb-3 bg-white rounded-lg border-gray-300 border">
          <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
            <div className="flex items-center space-x-4 content-start">
              <Image
                src={ppImage}
                alt="eksi-code-logo"
                className="rounded-full border-2"
                width="40"
                height="40"
              ></Image>
              <div className="space-y-1 font-medium ">
                <div>Jese Leos</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Joined in August 2014
                </div>
              </div>
            </div>
            <div className="w-full ml-14">
              <h1 className="text-2xl my-2 font-bold">
                <a href="/detail">
                  [Algorithms] 3 - Find First and Last Position of Element in
                  Sorted Array
                </a>
              </h1>
              <div>#cursogratuito #treinamento #cs50 #datascience</div>
              <div className="flex flex-nowrap mt-6 text-sm">
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
                  {" "}
                  <AiOutlineLike className="text-lg mr-2 mt-1 ml-1" /> Beğen{" "}
                </button>
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark mx-2">
                  {" "}
                  <AiOutlineMessage className="text-lg mr-2 mt-1 ml-1" /> Yorum
                  Ekle{" "}
                </button>
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
                  {" "}
                  <BiBookmarkAltPlus className="text-lg mr-2 mt-1 ml-1" />{" "}
                  Kaydet{" "}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 w-full px-1 mb-3 bg-white rounded-lg border-gray-300 border">
          <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
            <div className="flex items-center space-x-4 content-start">
              <Image
                src={ppImage}
                alt="eksi-code-logo"
                className="rounded-full border-2"
                width="40"
                height="40"
              ></Image>
              <div className="space-y-1 font-medium ">
                <div>Jese Leos</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Joined in August 2014
                </div>
              </div>
            </div>
            <div className="w-full ml-14">
              <h1 className="text-2xl my-2 font-bold">
                [Algorithms] 3 - Find First and Last Position of Element in
                Sorted Array
              </h1>
              <div>#cursogratuito #treinamento #cs50 #datascience</div>
              <div className="flex flex-nowrap mt-6 text-sm">
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
                  {" "}
                  <AiOutlineLike className="text-lg mr-2 mt-1 ml-1" /> Beğen{" "}
                </button>
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark mx-2">
                  {" "}
                  <AiOutlineMessage className="text-lg mr-2 mt-1 ml-1" /> Yorum
                  Ekle{" "}
                </button>
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
                  {" "}
                  <BiBookmarkAltPlus className="text-lg mr-2 mt-1 ml-1" />{" "}
                  Kaydet{" "}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 w-full px-1 mb-3 bg-white rounded-lg border-gray-300 border">
          <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
            <div className="flex items-center space-x-4 content-start">
              <Image
                src={ppImage}
                alt="eksi-code-logo"
                className="rounded-full border-2"
                width="40"
                height="40"
              ></Image>
              <div className="space-y-1 font-medium ">
                <div>Jese Leos</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Joined in August 2014
                </div>
              </div>
            </div>
            <div className="w-full ml-14">
              <h1 className="text-2xl my-2 font-bold">
                [Algorithms] 3 - Find First and Last Position of Element in
                Sorted Array
              </h1>
              <div>#cursogratuito #treinamento #cs50 #datascience</div>
              <div className="flex flex-nowrap mt-6 text-sm">
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
                  {" "}
                  <AiOutlineLike className="text-lg mr-2 mt-1 ml-1" /> Beğen{" "}
                </button>
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark mx-2">
                  {" "}
                  <AiOutlineMessage className="text-lg mr-2 mt-1 ml-1" /> Yorum
                  Ekle{" "}
                </button>
                <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
                  {" "}
                  <BiBookmarkAltPlus className="text-lg mr-2 mt-1 ml-1" />{" "}
                  Kaydet{" "}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Pagination />
      </div>

      <div className="flex w-3/12 sm:hidden md:hidden">
        <aside className="w-full" aria-label="Sidebar-right">
          <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border">
            <span className="w-full flex">
              <h1 className="text-lg font-bold">
                Ekşicode Yazılımcı Geliştirme Topluluğu
              </h1>
            </span>
            <h2 className="text-sm">
              Yazılım geliştiriciler için yapıcı ve kapsayıcı bir sosyal ağ.
              Yolculuğunuzun her adımında yanınızda.
            </h2>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Page;
