import React from "react";
import Image from "next/image";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { BiBookmarkAltPlus } from "react-icons/bi";
import ppImage from "../public/assets/pp-image.png";

const Post = () => {
  return (
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
            <div>Post Test</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Joined in August 2014
            </div>
          </div>
        </div>
        <div className="w-full ml-14">
          <h3 className="text-2xl my-2 font-bold">
            <a href="/detail">
              [Algorithms] 3 - Find First and Last Position of Element in Sorted
              Array
            </a>
          </h3>
          <div>#cursogratuito #treinamento #cs50 #datascience</div>
          <div className="flex flex-nowrap mt-6 text-sm">
            <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
              {" "}
              <AiOutlineLike className="text-lg mr-2 mt-1 ml-1" /> Beğen{" "}
            </button>
            <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark mx-2">
              {" "}
              <AiOutlineMessage className="text-lg mr-2 mt-1 ml-1" /> Yorum Ekle{" "}
            </button>
            <button className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark">
              {" "}
              <BiBookmarkAltPlus className="text-lg mr-2 mt-1 ml-1" /> Kaydet{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
