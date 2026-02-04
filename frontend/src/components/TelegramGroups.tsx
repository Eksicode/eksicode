import Link from "next/link";
import { useState, useEffect } from "react";
import Navlink from "@/components/Ui/NavLink";
import LoadingAnimation from "@/components/Ui/LoadingAnimation";
import getData from "@/utils/getData";
import { Tooltip } from "react-tooltip";
import { AiOutlineEdit } from "react-icons/ai";
import { useSession } from "next-auth/react";

interface Group {
  id: number;
  name: string;
  icon: string;
  link: string;
}

type TelegramGroupsProps = {
  groups?: Group[];
};

const mediaURL = process.env.NEXT_PUBLIC_MEDIA_URL;

const TelegramGroups: React.FC<TelegramGroupsProps> = ({ groups }) => {
  const [fetchedGroups, setFetchedGroups] = useState<Group[]>(groups || []);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch a fixed number of groups (e.g., 20) to allow scrolling
        const fetchedPosts = await getData<Group>("telegrams", true, 20);
        const groups = fetchedPosts.data.map((item) => ({
          id: item.id,
          name: item.name,
          icon: mediaURL + item.icon,
          link: item.link,
        })) as Group[];
        setFetchedGroups(groups);
      } catch (error) {
        console.error("Error fetching telegram groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center w-full h-16 overflow-hidden px-2">
      {loading ? (
        <div className="flex w-full justify-center">
          <LoadingAnimation style="" />
        </div>
      ) : (
        <div className="flex w-full justify-start md:justify-center items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <span className="text-eksiCodeMedium dark:text-eksiCodeLight whitespace-nowrap mr-2 hidden md:block">
            Telegram Grupları
          </span>

          {/* Mobile "New Post" button if logged in - integrated into the flow or kept separate? 
                Original had it strictly for mobile. Let's keep it if we want, but maybe better in UserMenu?
                For now, sticking to the groups scroll.
            */}

          {fetchedGroups.length > 0 ? (
            <>
              {fetchedGroups.map((group: Group) => (
                <div
                  key={group.id}
                  className="flex-shrink-0"
                  data-tooltip-id={group.name}
                  data-tooltip-content={group.name}
                  data-tooltip-place="bottom"
                >
                  <Link
                    href={group.link}
                    target="_blank"
                    className="block h-12 w-12 rounded-full"
                  >
                    <img
                      src={group.icon}
                      alt={group.name}
                      style={{ objectFit: "fill" }}
                      width={50}
                      height={50}
                      loading="lazy"
                      className="rounded-full h-12 w-12 opacity-80 hover:opacity-100 dark:opacity-60 dark:hover:opacity-100 transition duration-300 ease-in-out"
                    />
                  </Link>
                  <Tooltip
                    id={group.name}
                    place="bottom"
                    content={group.name}
                  />
                </div>
              ))}
              <div className="flex-shrink-0">
                <Navlink variant="secondary" href="/telegram-gruplari" style="whitespace-nowrap">
                  Bütün Gruplar
                </Navlink>
              </div>
            </>
          ) : (
            <h1>Telegram grubu bulunamadı</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default TelegramGroups;
