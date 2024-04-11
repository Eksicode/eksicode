import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Tooltip } from "react-tooltip";
import Image from "next/image";
import Navlink from "@components/Ui/NavLink";
import LoadingAnimation from "@components/Ui/LoadingAnimation";
import getGroups from "@providers/getGroups";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await getGroups(15);
      setFetchedGroups(fetchedPosts);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center w-3/4 md:w-full h-16 justify-between overflow-hidden">
      {loading ? (
        <div className="flex w-full justify-center">
          <LoadingAnimation style="" />
        </div>
      ) : (
        <>
          <p>Telegram Grupları</p>
          {fetchedGroups?.length > 0 ? (
            <>
              {fetchedGroups?.map((group: Group) => (
                <div
                  key={group.id}
                  className="flex items-center"
                  data-tooltip-id={group.name}
                  data-tooltip-content={group.name}
                  data-tooltip-place="bottom"
                >
                  <Link
                    key={group.id}
                    href={group.link}
                    target="_blank"
                    className="h-12 w-12 rounded-full"
                  >
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
              <Navlink
                variant="quaternary"
                clasName="border border-white"
                href="/telegram-gruplari"
              >
                Bütün Gruplar
              </Navlink>
            </>
          ) : (
            <h1>Telegram grubu bulunamadı</h1>
          )}
        </>
      )}
    </div>
  );
}
