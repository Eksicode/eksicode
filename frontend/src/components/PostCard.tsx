"use client"

import React from "react";
import Image from "next/image";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { BiBookmarkAltPlus } from "react-icons/bi";
import ppImage from "../public/assets/pp-image.png";
import { formatDate } from "@/utils/utils";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  image?: string;
  joinedDate?: string;
}

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: Author;
    tags?: { id: string; name: string }[];
    likes?: number;
    slug?: string;
    comments?: { id: string }[];
    createdAt?: string;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

const generateRandomNumber = (): number => Math.floor(Math.random() * 1000);

export function PostCard({ post, onLike, onComment, onSave }: PostCardProps) {
  const { id, title, slug, author, tags = [], comments = [] } = post;

  return (
    <>
      <div key={generateRandomNumber()} className="py-4 w-full px-1 mb-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
        <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
          <div className="flex items-center space-x-4 content-start">
            <Image
              src={author.image || ppImage}
              alt={`${author.name}'s avatar`}
              className="rounded-full border-2"
              width="40"
              height="40"
            ></Image>
            <div className="space-y-1 font-medium ">
              <div>{author.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {author.joinedDate && (
                  <p className="text-xs text-muted-foreground">
                    Joined {formatDate(author.joinedDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full ml-14">
            <h2 className="text-2xl my-2 font-bold">
              <a href={`/posts/${slug}`}>{title}</a>
            </h2>
            <div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-nowrap mt-6 text-sm">
              <button
                onClick={() => onLike?.(id)}
                className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark"
              >
                {" "}
                <AiOutlineLike className="text-lg mr-2 mt-1 ml-1" /> Beğen{" "}
              </button>
              <button
                onClick={() => onComment?.(id)}
                className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark mx-2"
              >
                {" "}
                <AiOutlineMessage className="text-lg mr-2 mt-1 ml-1" /> Yorum
                Ekle{" "}
              </button>
              <button
                onClick={() => onSave?.(id)}
                className="flex flex-nowrap p-1 border border-eksiContent hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark"
              >
                {" "}
                <BiBookmarkAltPlus className="text-lg mr-2 mt-1 ml-1" /> Kaydet{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
