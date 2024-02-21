import Link from "next/link";
import { Tooltip } from "react-tooltip";

interface Group {
  id: number;
  name: string;
  logo: string;
  link: string;
}

type TelegramGroupsProps = {
  groups?: Group[];
};

async function getData() {
  const res = await fetch(
    "https://api.eksicode.org/telegrams?_sort=ListOrder:ASC"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function TelegramGroups() {
  const groups = await getData();

  const popularGroups = groups.slice(0, 15);

  return (
    <div className="flex items-center sm:basis-full basis-3/4 h-16 mx-10 sm:mx-4 justify-center">
      {popularGroups?.map((group: Group) => (
        <div key={group.id}>
          <div className="my-anchor-element" data-tooltip-place="bottom" data-tooltip-content={group.name} key={group.name}>
          <Link  key={group.id} href={`${group.link}`} target="_blank">
            <div className="flex items-center m-4 opacity-60 hover:opacity-100">
              <img
                src={group.logo}
                alt={group.name}
                className="w-12 h-12 rounded-full"
              />
              <Tooltip anchorSelect=".my-anchor-element" key={group.name}/>
            </div>
          </Link>
          </div>
        </div>
      ))}
      <Link href="/groups">Bütün Gruplar</Link>
    </div>
  );
}
