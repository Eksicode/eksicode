import React from "react";
import Image from "next/image";
import Navlink from "@/components/Ui/NavLink";
interface Group {
  id: number;
  name: string;
  icon: string;
  link?: string;
  members: string;
}

const TelegramGroupCard = (group: Group) => {
  return (
    <div className="relative grid content-between justify-items-center sm:w-full h-64 w-52 flex-col bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey border shadow-md rounded-lg p-2 m-2">
      <Image
        src={group.icon}
        alt="eksi-code-logo"
        className="h-20 w-20 rounded-full"
        width="80"
        height="80"
      />
      <div className="p-4 text-center">
        <h4 className="mb-2 font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {group.name}
        </h4>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400">
          {group.members} Üye
        </p>
      </div>
      <Navlink
        variant="tertiary"
        href={group.link}
        target="_blank"
        clasName="w-[150px]"
      >
        Katıl
      </Navlink>
    </div>
  );
};

export default TelegramGroupCard;
