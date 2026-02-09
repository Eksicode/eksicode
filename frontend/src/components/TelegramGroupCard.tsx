import React from "react";
import Image from "next/image";
import Navlink from "@/components/Ui/NavLink";

const mediaURL = process.env.NEXT_PUBLIC_MEDIA_URL;

interface Group {
  id: number;
  name: string;
  icon: string;
  link?: string;
  members: number;
}

const TelegramGroupCard = (group: Group) => {
  return (
    <div className="relative grid content-between justify-items-center w-full h-60 flex-col bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey border shadow-md rounded-lg p-4">
      <Image
        src={mediaURL + group.icon}
        alt="eksi-code-logo"
        className="h-16 w-16 rounded-full"
        width="80"
        height="80"
      />
      <div className="text-center">
        <h4 className="mb-2 font-sans text-sm antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {group.name}
        </h4>
        <p className="block font-sans antialiased text-xs leading-relaxed text-black dark:text-white">
          {group.members} Üye
        </p>
      </div>
      <Navlink
        variant="tertiary"
        href={group.link}
        target="_blank"
        style="w-full block text-center"
      >
        Katıl
      </Navlink>
    </div>
  );
};

export default TelegramGroupCard;
