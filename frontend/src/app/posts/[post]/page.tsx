import React from "react";
import Image from "next/image";
import SideMenu from "@/components/Nav/SideMenu";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { IPost, IComment } from "@/types/types";
import { formatDate } from "@/utils/utils";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import { BiBookmarkAltPlus } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import ppImage from "../../../../public/images/pp-image.png";

// API response wrapper type
interface PostResponse {
  data: IPost;
  message: string;
}

// Params type for Next.js 15
interface PostPageParams {
  params: Promise<{ post: string }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PostPageParams): Promise<Metadata> {
  const { post: slug } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`,
      { cache: "force-cache" }
    );

    if (!response.ok) {
      return {
        title: "Gönderi Bulunamadı - EksiCode",
      };
    }

    const { data: postData }: PostResponse = await response.json();

    // Get header image URL if available
    const imageUrl = postData.headerImage && typeof postData.headerImage === 'object'
      ? postData.headerImage.url
      : undefined;

    return {
      title: `${postData.title} - EksiCode`,
      description: postData.content?.substring(0, 160) || "",
      openGraph: {
        title: postData.title,
        description: postData.content?.substring(0, 160) || "",
        type: "article",
        publishedTime: postData.publishedAt || postData.createdAt,
        authors: [postData.author.username],
        tags: postData.tags?.map(tag => tag.name) || [],
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: postData.title,
        description: postData.content?.substring(0, 160) || "",
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "EksiCode",
    };
  }
}

/**
 * Post Detail Page Component
 */
export default async function PostDetailPage({ params }: PostPageParams) {
  const { post: slug } = await params;

  let postData: IPost;

  try {
    // Fetch post data with view count increment
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}?incrementView=true`,
      {
        cache: "no-store", // Don't cache to ensure view count updates
        next: { revalidate: 60 }, // Revalidate every minute for fresh data
      }
    );

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    }

    // Extract data from response wrapper
    const responseData: PostResponse = await response.json();
    postData = responseData.data;

    if (!postData) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }

  // Sanitize content
  const sanitizedContent = DOMPurify.sanitize(postData.content || "");

  // Get header image URL
  const headerImageUrl = postData.headerImage && typeof postData.headerImage === 'object'
    ? postData.headerImage.url
    : null;

  // Get author profile picture
  const getAuthorProfilePicture = () => {
    if (postData.author.profilePicture) {
      if (typeof postData.author.profilePicture === 'object' && postData.author.profilePicture.url) {
        return postData.author.profilePicture.url;
      }
      if (typeof postData.author.profilePicture === 'string') {
        return postData.author.profilePicture;
      }
    }
    return ppImage;
  };

  return (
    <div className="flex py-5 basis-full xl:basis-3/4">
      {/* Left Sidebar - Menu */}
      <div className="flex">
        <SideMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center">
        <div className="flex flex-wrap justify-start w-full max-w-4xl mx-2">
          {/* Post Card */}
          <article className="w-full p-6 mb-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-DarkLightGrey">
              <div className="flex items-center space-x-4">
                <Image
                  src={getAuthorProfilePicture()}
                  alt={`${postData.author.username}'s avatar`}
                  className="rounded-full border-2 border-gray-300 dark:border-DarkLightGrey"
                  width={48}
                  height={48}
                />
                <div>
                  <div className="font-semibold text-lg">
                    {postData.author.firstName && postData.author.lastName
                      ? `${postData.author.firstName} ${postData.author.lastName}`
                      : postData.author.username}
                    {postData.author.verified && (
                      <span className="ml-1 text-blue-500" title="Verified">✓</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    @{postData.author.username}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                <div>{formatDate(postData.createdAt)}</div>
                {postData.viewCount && postData.viewCount > 0 && (
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <BsEye className="text-base" />
                    <span>{postData.viewCount} görüntülenme</span>
                  </div>
                )}
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {postData.title}
            </h1>

            {/* Categories */}
            {postData.categories && postData.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {postData.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {postData.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Header Image */}
            {headerImageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <Image
                  src={headerImageUrl}
                  alt={postData.headerImage && typeof postData.headerImage === 'object'
                    ? postData.headerImage.altText || postData.title
                    : postData.title}
                  width={1200}
                  height={630}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}

            {/* Post Content */}
            <div
              className="prose dark:prose-invert max-w-none mb-8
                prose-headings:text-black dark:prose-headings:text-white
                prose-p:text-gray-800 dark:prose-p:text-gray-200
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-strong:text-black dark:prose-strong:text-white
                prose-code:text-pink-600 dark:prose-code:text-pink-400
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-DarkLightGrey">
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-DarkLightGrey 
                  hover:border-eksiCode hover:text-eksiCode dark:hover:text-eksiCode rounded-lg 
                  transition-colors duration-200"
                title="Beğen"
              >
                <AiOutlineLike className="text-lg" />
                <span>Beğen</span>
                {postData.postLikes && postData.postLikes.length > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {postData.postLikes.length}
                  </span>
                )}
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-DarkLightGrey 
                  hover:border-eksiCode hover:text-eksiCode dark:hover:text-eksiCode rounded-lg 
                  transition-colors duration-200"
                title="Yorum Yap"
              >
                <AiOutlineMessage className="text-lg" />
                <span>Yorum Yap</span>
                {postData.comments && postData.comments.length > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {postData.comments.length}
                  </span>
                )}
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-DarkLightGrey 
                  hover:border-eksiCode hover:text-eksiCode dark:hover:text-eksiCode rounded-lg 
                  transition-colors duration-200"
                title="Kaydet"
              >
                <BiBookmarkAltPlus className="text-lg" />
                <span>Kaydet</span>
              </button>
            </div>
          </article>

          {/* Comments Section */}
          {postData.comments && postData.comments.length > 0 && (
            <section className="w-full p-6 mb-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
              <h2 className="text-2xl font-bold mb-6">
                Yorumlar ({postData.comments.length})
              </h2>

              <div className="space-y-4">
                {postData.comments.map((comment: IComment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      {/* Comment Author Avatar */}
                      <Image
                        src={
                          comment.author.profilePicture && typeof comment.author.profilePicture === 'object'
                            ? comment.author.profilePicture.url
                            : comment.author.profilePicture || ppImage
                        }
                        alt={`${comment.author.username}'s avatar`}
                        className="rounded-full border-2 border-gray-300 dark:border-gray-700"
                        width={40}
                        height={40}
                      />

                      <div className="flex-1">
                        {/* Comment Author Info */}
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold">
                              {comment.author.firstName && comment.author.lastName
                                ? `${comment.author.firstName} ${comment.author.lastName}`
                                : comment.author.username}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              @{comment.author.username}
                            </span>
                            {comment.author.verified && (
                              <span className="ml-1 text-blue-500" title="Verified">✓</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt || "")}
                          </span>
                        </div>

                        {/* Comment Content */}
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No Comments Message */}
          {(!postData.comments || postData.comments.length === 0) && (
            <section className="w-full p-6 mb-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
              <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
