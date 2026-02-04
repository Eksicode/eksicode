"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { BiBookmarkAltPlus } from "react-icons/bi";
import ppImage from "../../public/images/pp-image.png";
import { formatDate } from "@/utils/utils";
import { IPost } from "@/types/types";

interface PostCardProps {
  post: IPost;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onSave?: (postId: number) => void;
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
    tags = [],
    createdAt
  } = post;

  // Handle profile picture - can be Media object or string
  const getProfilePictureUrl = () => {
    if (author.profilePicture) {
      // If it's a Media object, use the url property
      if (typeof author.profilePicture === 'object' && author.profilePicture.url) {
        return author.profilePicture.url;
      }
      // If it's a string, use it directly
      if (typeof author.profilePicture === 'string') {
        return author.profilePicture;
      }
    }
    return ppImage;
  };

  return (
    <div className="py-4 w-full px-1 mb-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
      <div className="flex flex-wrap basis-full lg:basis-3/4 md:mx-3 mx-2 justify-between">
        {/* Author Info */}
        <div className="flex items-center space-x-4 content-start">
          <Image
            src={getProfilePictureUrl()}
            alt={`${author.username}'s avatar`}
            className="rounded-full border-2"
            width={40}
            height={40}
          />
          <div className="space-y-1 font-medium">
            <div>{author.username}</div>
            {createdAt && (
              <p className="text-xs text-muted-foreground">
                {formatDate(createdAt)}
              </p>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="w-full ml-0 lg:ml-14">
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
          <div className="flex gap-2 flex-nowrap mt-6 text-sm">
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
                className="flex items-center flex-nowrap p-1 border border-eksiContent hover:border-eksiCode dark:hover:text-eksiCode rounded-lg hover:text-eksiCode dark:text-white text-dark"
              >
                <Icon className="text-lg" />
                <p className="hidden md:block ml-1">
                  {text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};