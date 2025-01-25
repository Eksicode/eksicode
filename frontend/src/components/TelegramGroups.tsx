import Link from "next/link";
import { useState, useEffect } from "react";
import Navlink from "@/components/Ui/NavLink";
import LoadingAnimation from "@/components/Ui/LoadingAnimation";
import getData from "@/utils/getData";
import { Tooltip } from "react-tooltip";

interface Group {
  id: number;
  name: string;
  icon: string;
  link: string;
}

type TelegramGroupsProps = {
  groups?: Group[];
};

const TelegramGroups: React.FC<TelegramGroupsProps> = ({ groups }) => {
  const initialLogoCount = 17;
  const logoWidth = 70;
  const mobileWidth = 780;

  const [fetchedGroups, setFetchedGroups] = useState<Group[]>(groups || []);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [logoCount, setLogoCount] = useState<number>(initialLogoCount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getData("telegrams", true, logoCount);
        const groups = fetchedPosts.data.map((item) => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          link: item.link,
        })) as Group[];
        setFetchedGroups(groups);
        console.log("Fetched telegram groups:", fetchedPosts);
      } catch (error) {
        console.error("Error fetching telegram groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth < mobileWidth);
      const newLogoCount = Math.floor(screenWidth / logoWidth);
      setLogoCount(Math.min(newLogoCount, initialLogoCount));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [logoCount, mobileWidth, initialLogoCount, logoWidth]);

  return (
    <div className="flex items-center lg:w-full xl:w-3/4 2xl:w-3/4 md:w-full h-16 justify-between overflow-hidden ">
      {isMobile ? (
        <div className="flex w-full justify-center">
          <Navlink
            variant="primary"
            style="border border-white"
            href="/telegram-gruplari"
          >
            Bütün Telegram Grupları
          </Navlink>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex w-full justify-center">
              <LoadingAnimation style="" />
            </div>
          ) : (
            <>
              <p className="text-eksiCodeMedium dark:text-eksiCodeLight">Telegram Grupları</p>
              {fetchedGroups.length > 0 ? (
                <>
                  {fetchedGroups.slice(0, logoCount).map((group: Group) => (
                    <div
                      key={group.id}
                      className="flex items-center"
                      data-tooltip-id={group.name}
                      data-tooltip-content={group.name}
                      data-tooltip-place="bottom"
                    >
                      <Link
                        href={group.link}
                        target="_blank"
                        className="h-12 w-12 rounded-full"
                      >
                        <img
                          src={group.icon}
                          alt={group.name}
                          style={{ objectFit: "fill" }}
                          width={50}
                          height={50}
                          loading="lazy"
                          className="rounded-full opacity-80 hover:opacity-100 dark:opacity-60 dark:hover:opacity-100 transition duration-300 ease-in-out"
                        />
                      </Link>
                      <Tooltip
                        id={group.name}
                        place="bottom"
                        content={group.name}
                      />
                    </div>
                  ))}
                  <Navlink
                    variant="secondary"
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
        </>
      )}
    </div>
  );
};

export default TelegramGroups;
