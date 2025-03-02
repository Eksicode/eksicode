import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{ username?: string; profilePicture?: string }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!session?.user?.id || !session?.accessToken) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        if (response.ok) {
          const fetchedUserData = await response.json();
          setUserData({
            username: fetchedUserData.username || session.user.username,
            profilePicture: fetchedUserData.profilePicture || session.user.profilePicture
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (session?.accessToken && session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    toggleMenu();
  };

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await signOut();
  };

  return (
    <div
      className="relative hidden lg:inline-block text-left z-50"
      ref={menuRef}
    >
      <div>
        <button
          onClick={toggleMenu}
          className="flex justify-center outline-none focus:outline-none focus:border-none"
        >
          <span className="relative w-10 h-10 ml-2 overflow-hidden ring-2 ring-gray-300 bg-gray-100 rounded-full dark:bg-gray-600">
            {userData.profilePicture ? (
              <Image
                src={userData.profilePicture}
                alt="Profile picture"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <svg
                className="absolute w-12 h-12 text-gray-400 -left-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-DarkerGrey ring-1 ring-eksiCode">
          <div className="py-1">
            <span className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey ">
              @ {userData.username || session?.user?.username}
            </span>
            <hr className="border-t border-gray-300 hover:bg-gray-100" />
            <Link
              onClick={handleLinkClick}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey "
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              onClick={handleLinkClick}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey "
              href="/dashboard/favoriler"
            >
              Favoriler
            </Link>
            <Link
              onClick={handleLinkClick}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey "
              href="/dashboard/ayarlar"
            >
              Ayarlar
            </Link>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey w-full text-left"
            >
              Güvenli Çıkış
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
