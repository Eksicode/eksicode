"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { BiBookmarkAltPlus } from "react-icons/bi";
import ppImage from "../public/assets/pp-image.png";
import { formatDate } from "@/utils/utils";

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

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onSave 
}) => {
  const { 
    id, 
    title, 
    slug, 
    author, 
    tags = [] 
  } = post;

  return (
    <div className="py-4 w-full px-1 mb-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
      <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
        {/* Author Info */}
        <div className="flex items-center space-x-4 content-start">
          <Image
            src={author.image || ppImage}
            alt={`${author.name}'s avatar`}
            className="rounded-full border-2"
            width={40}
            height={40}
          />
          <div className="space-y-1 font-medium">
            <div>{author.name}</div>
            {author.joinedDate && (
              <p className="text-xs text-muted-foreground">
                Joined {formatDate(author.joinedDate)}
              </p>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="w-full ml-14">
          <h2 className="text-2xl my-2 font-bold">
            <Link href={`/posts/${slug}`}>{title}</Link>
          </h2>

          {/* Tags */}
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

          {/* Action Buttons */}
          <div className="flex flex-nowrap mt-6 text-sm">
            {[
              { 
                Icon: AiOutlineLike, 
                text: "Beğen", 
                onClick: () => onLike?.(id) 
              },
              { 
                Icon: AiOutlineMessage, 
                text: "Yorum Ekle", 
                onClick: () => onComment?.(id) 
              },
              { 
                Icon: BiBookmarkAltPlus, 
                text: "Kaydet", 
                onClick: () => onSave?.(id) 
              }
            ].map(({ Icon, text, onClick }) => (
              <button
                key={text}
                onClick={onClick}
                className="flex flex-nowrap p-1 border border-eksiContent hover:border-eksiCode rounded-lg hover:text-eksiCode text-dark mx-1"
              >
                <Icon className="text-lg mr-2 mt-1 ml-1" /> {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};