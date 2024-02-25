import Link from "next/link";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import Image from "next/image";

interface Group {
  id: number;
  name: string;
  logo: string;
  link: string;
}

type TelegramGroupsProps = {
  groups?: Group[];
};

export default function TelegramGroups({ groups }: TelegramGroupsProps) {
  const [fetchedGroups, setFetchedGroups] = useState<Group[]>(groups || []);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/groups");
      if (res.ok) {
        const data = await res.json();
        setFetchedGroups(data.data.slice(0, 15));

        if (data.data.length > 0) {
          setFetchedGroups(data.data.slice(0, 15));
        } else {
          setFetchedGroups([]);
        }
      } else {
        console.error("Failed to fetch data");
      }
    }
    fetchData();
  }, []);
  console.log(fetchedGroups);
  return (
    <div className="flex items-center w-3/4 md:w-full h-16 justify-between overflow-hidden">
      {fetchedGroups?.length >= 0 ? (
        <>
          {fetchedGroups?.map((group: Group) => (
            <div
              key={group.id}
              className="flex items-center"
              data-tooltip-id={group.name}
              data-tooltip-content={group.name}
              data-tooltip-place="bottom"
            >
              <Link key={group.id} href={group.link} target="_blank" className="h-12 w-12 rounded-full">
                <Image
                  src={group.logo}
                  alt={group.name}
                  style={{ objectFit: "fill" }}
                  width={50}
                  height={50}
                  loading="lazy"
                  className="rounded-full"
                />
              </Link>
              <Tooltip
                id={group.name}
                //anchorSelect=".my-anchor-element"
                place="bottom"
                content={group.name}
              />
            </div>
          ))}
          <Link href="/telegram-gruplari">Bütün Gruplar</Link>
        </>
      ) : (
        <h1>Telegram grubu bulunamadı</h1>
      )}
    </div>
  );
}
