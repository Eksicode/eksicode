import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import Button from "@/components/Ui/Button";

export default function Loading() {
  // Create skeleton cards for loading state
  const skeletonCards = Array.from({ length: 12 }, (_, index) => (
    <div
      key={index}
      className="relative flex items-start flex-col justify-start bg-white dark:bg-DarkerGrey dark:border-DarkLightGrey border border-gray-200 shadow-md bg-clip-border rounded-xl w-[45%] lg:w-[30%] p-2 m-2 animate-pulse"
    >
      <div className="p-4 w-full">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        {/* Post count skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
      </div>
      {/* Description skeleton */}
      <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded w-full mx-4 mb-4"></div>
      {/* Buttons skeleton */}
      <div className="flex flex-col lg:flex-row w-full gap-2 flex-nowrap p-4">
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
      </div>
    </div>
  ));

  return (
    <div className="flex py-5 basis-full xl:basis-3/4">
      <div className="flex">
        <SideMenu />
      </div>
      <div className="flex flex-wrap w-full justify-center text-center">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600 dark:bg-DarkerGrey dark:border-DarkLightGrey dark:text-white">
          <div className="text-3xl text-bold">
            Etiketler
            <div className="inline-block ml-2 h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              children="Takipteki Etiketler"
            />
            <Button
              variant="secondary"
              children="Gizli Etiketler"
            />
          </div>
        </div>

        <div className="flex flex-wrap w-full justify-between lg:mx-0 mx-2">
          {skeletonCards}
        </div>

        {/* Loading pagination skeleton */}
        <div className="flex flex-col items-center w-full mt-6">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4 animate-pulse"></div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
