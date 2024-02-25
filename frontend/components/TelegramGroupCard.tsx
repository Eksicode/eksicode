import React from "react";
import Link from "next/link";
import Image from "next/image";
interface Group {
  id: number;
  name: string;
  logo: string;
  link: string;
  members: number;
}

const TelegramGroupCard = (group: Group) => {
  return (
    <div className="relative flex flex-col align-top justify-center items-center text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-56 p-2 m-2">
      <Image
        src={group.logo}
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
      <Link href={group.link} target="_blank" className="mt-2">
        Katıl
      </Link>
    </div>
  );
};

export default TelegramGroupCard;
