import React from "react";
import Link from "next/link";
import TelegramGroupCard from "@components/TelegramGroupCard";
import SideMenu from "@components/Nav/SideMenu";
interface Group {
  id: number;
  name: string;
  logo: string;
  link: string;
  members: number;
}

type TelegramGroupsProps = {
  groups?: Group[];
};

async function getData() {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/groups?count=total",
      { next: { revalidate: 43200 } }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
export default async function Groups() {
  const groups = await getData();

  return (
    <>
      <div className="flex w-1/3">
        <SideMenu />
      </div>
      <div className="flex flex-wrap w-2/3 sm:w-full md:w-full justify-center text-center">
        <div className="flex flex-wrap justify-center w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
          <p className="w-full text-3xl text-bold mb-4">Telegram Grupları</p>
          <p className="w-full mb-4">
            İlgilendiğin yazılım dili veya konular ile ilgili telegram
            gruplarımıza katılabilirsin.
          </p>
          <Link
            href="https://telegram.org/dl/"
            data-te-ripple-init
            data-te-ripple-color="light"
            className="flex mb-4 rounded px-6 py-2 text-xs h-8 align-middle font-medium leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
            style={{ backgroundColor: "#0088cc" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="h-4 w-4 mr-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlSpace="preserve"
              style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                strokeLinejoin: "round",
                strokeMiterlimit: 1.41421,
              }}
            >
              <path
                id="telegram-1"
                d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z"
              />
            </svg>
            Telegram'ı İndir
          </Link>
          <div className="w-full text-sm">
            <Link href="/grup-kurallari">Grup Kuralları için tıklayın</Link>
          </div>
        </div>

        <div className="flex flex-wrap w-full justify-between sm:mx-2">
          {groups.data?.map((group: Group) => (
            <TelegramGroupCard {...group} />
          ))}
        </div>
      </div>
    </>
  );
}
