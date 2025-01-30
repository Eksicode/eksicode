import React from "react";
import Image from "next/image";
import Navlink from "@/components/Ui/NavLink";
interface Group {
  id: number;
  name: string;
  icon: string;
  link?: string;
  members: number;
}

const TelegramGroupCard = (group: Group) => {
  return (
    <div className="relative grid content-between justify-items-center sm:w-full h-60 w-52 flex-col bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey border shadow-md rounded-lg p-4 m-2">
      <Image
        src={group.icon}
        alt="eksi-code-logo"
        className="h-16 w-16 rounded-full"
        width="80"
        height="80"
      />
      <div className="text-center">
        <h4 className="mb-2 font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {group.name}
        </h4>
        <p className="block font-sans antialiased text-sm leading-relaxed text-black dark:text-white">
          {group.members} Üye
        </p>
      </div>
      <Navlink
        variant="tertiary"
        href={group.link}
        target="_blank"
        style="w-[150px]"
      >
        Katıl
      </Navlink>
    </div>
  );
};

export default TelegramGroupCard;
