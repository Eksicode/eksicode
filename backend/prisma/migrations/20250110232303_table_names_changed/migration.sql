/*
  Warnings:

  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HashTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Menus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TelegramGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HashTagsToPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PageCategoriesToPages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostCategoriesToPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JobEmploymentTypeEnum" AS ENUM ('fullTime', 'partTime', 'contract', 'temporary', 'internship');

-- CreateEnum
CREATE TYPE "NotificationTypeEnum" AS ENUM ('yorum', 'gönderi', 'hata', 'yönetim', 'mesaj');

-- CreateEnum
CREATE TYPE "MediaTypeEnum" AS ENUM ('image', 'video', 'audio', 'document');

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "Jobs" DROP CONSTRAINT "Jobs_usersId_fkey";

-- DropForeignKey
ALTER TABLE "MenuCategories" DROP CONSTRAINT "MenuCategories_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostLikes" DROP CONSTRAINT "PostLikes_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostLikes" DROP CONSTRAINT "PostLikes_userId_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermissions" DROP CONSTRAINT "RolePermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermissions" DROP CONSTRAINT "RolePermissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Sources" DROP CONSTRAINT "Sources_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoles" DROP CONSTRAINT "UserRoles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoles" DROP CONSTRAINT "UserRoles_userId_fkey";

-- DropForeignKey
ALTER TABLE "_HashTagsToPosts" DROP CONSTRAINT "_HashTagsToPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_HashTagsToPosts" DROP CONSTRAINT "_HashTagsToPosts_B_fkey";

-- DropForeignKey
ALTER TABLE "_PageCategoriesToPages" DROP CONSTRAINT "_PageCategoriesToPages_A_fkey";

-- DropForeignKey
ALTER TABLE "_PageCategoriesToPages" DROP CONSTRAINT "_PageCategoriesToPages_B_fkey";

-- DropForeignKey
ALTER TABLE "_PostCategoriesToPosts" DROP CONSTRAINT "_PostCategoriesToPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostCategoriesToPosts" DROP CONSTRAINT "_PostCategoriesToPosts_B_fkey";

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "HashTags";

-- DropTable
DROP TABLE "Jobs";

-- DropTable
DROP TABLE "MenuCategories";

-- DropTable
DROP TABLE "Menus";

-- DropTable
DROP TABLE "Notifications";

-- DropTable
DROP TABLE "PageCategories";

-- DropTable
DROP TABLE "Pages";

-- DropTable
DROP TABLE "Permissions";

-- DropTable
DROP TABLE "PostCategories";

-- DropTable
DROP TABLE "PostLikes";

-- DropTable
DROP TABLE "Posts";

-- DropTable
DROP TABLE "RolePermissions";

-- DropTable
DROP TABLE "Roles";

-- DropTable
DROP TABLE "Sources";

-- DropTable
DROP TABLE "TelegramGroups";

-- DropTable
DROP TABLE "UserRoles";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "_HashTagsToPosts";

-- DropTable
DROP TABLE "_PageCategoriesToPages";

-- DropTable
DROP TABLE "_PostCategoriesToPosts";

-- DropEnum
DROP TYPE "JobEmploymentType";

-- DropEnum
DROP TYPE "MediaTypes";

-- DropEnum
DROP TYPE "NotificationTypes";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT NOT NULL,
    "profilePicture" TEXT,
    "birthday" TIMESTAMP(3),
    "telegramId" INTEGER,
    "phoneNumber" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "headerImage" TEXT,
    "authorId" INTEGER NOT NULL,
    "status" "PostStatusEnum" NOT NULL DEFAULT 'draft',
    "slug" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hash_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "hash_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "headerImg" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "members" INTEGER NOT NULL DEFAULT 0,
    "link" TEXT NOT NULL,
    "channelId" TEXT,
    "listOrder" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telegram_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "subMenu" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationTypeEnum" NOT NULL,
    "userId" INTEGER NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "EmploymentType" "JobEmploymentTypeEnum" NOT NULL,
    "Department" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usersId" INTEGER,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "headers" TEXT,
    "url" TEXT NOT NULL,
    "tgChannel" TEXT,
    "tgUser" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToPostCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PostToPostCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HashTagToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HashTagToPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PageToPageCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PageToPageCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "post_categories_name_key" ON "post_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hash_tags_name_key" ON "hash_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_userId_postId_key" ON "post_likes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "page_categories_name_key" ON "page_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_groups_name_key" ON "telegram_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_name_key" ON "menu_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sources_title_key" ON "sources"("title");

-- CreateIndex
CREATE INDEX "_PostToPostCategory_B_index" ON "_PostToPostCategory"("B");

-- CreateIndex
CREATE INDEX "_HashTagToPost_B_index" ON "_HashTagToPost"("B");

-- CreateIndex
CREATE INDEX "_PageToPageCategory_B_index" ON "_PageToPageCategory"("B");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_id_fkey" FOREIGN KEY ("id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostCategory" ADD CONSTRAINT "_PostToPostCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostCategory" ADD CONSTRAINT "_PostToPostCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "post_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HashTagToPost" ADD CONSTRAINT "_HashTagToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "hash_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HashTagToPost" ADD CONSTRAINT "_HashTagToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToPageCategory" ADD CONSTRAINT "_PageToPageCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageToPageCategory" ADD CONSTRAINT "_PageToPageCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "page_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
