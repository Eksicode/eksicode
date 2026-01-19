"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{ username?: string; profilePicture?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();

  const fetchUserData = useCallback(async () => {
    try {
      if (!user?.id || !token) {
        // Use fallback data from useAuth if available
        if (user?.username) {
          setUserData({
            username: user.username,
            profilePicture: user.profilePicture
          });
        }
        return;
      }

      setLoading(true);
      setError(null);

      const userInfo = await authService.getCurrentUser(token);
      
      if (userInfo?.success && userInfo.data) {
        setUserData({
          username: userInfo.data.username || user.username,
          profilePicture: userInfo.data.profilePicture || user.profilePicture
        });
      } else {
        // Fallback to user data from useAuth
        setUserData({
          username: user.username,
          profilePicture: user.profilePicture
        });
        
        if (userInfo?.message) {
          console.warn('Failed to fetch user data:', userInfo.message);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError("Kullanıcı bilgileri yüklenirken bir hata oluştu");
      
      // Fallback to user data from useAuth
      if (user?.username) {
        setUserData({
          username: user.username,
          profilePicture: user.profilePicture
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setError("Çıkış yapılırken bir hata oluştu");
      // Still try to sign out even if there's an error
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const displayUsername = userData.username || user?.username || "Kullanıcı";
  const shouldShowImage = userData.profilePicture && !imageError;

  return (
    <div
      className="relative text-left z-50"
      ref={menuRef}
    >
      <div>
        <button
          onClick={toggleMenu}
          disabled={loading}
          className="flex justify-center outline-none focus:outline-none focus:border-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Kullanıcı menüsü"
          aria-expanded={isOpen}
        >
          <span className="relative w-10 h-10 ml-2 overflow-hidden ring-2 ring-gray-300 bg-gray-100 rounded-full dark:bg-gray-600">
            {shouldShowImage ? (
              <Image
                src={userData.profilePicture!}
                alt="Profile picture"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                onError={handleImageError}
                onLoadingComplete={() => setImageError(false)}
              />
            ) : (
              <svg
                className="absolute w-12 h-12 text-gray-400 -left-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
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
            {error && (
              <div className="px-4 py-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20">
                {error}
              </div>
            )}
            <span className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey truncate">
              @ {displayUsername}
            </span>
            <hr className="border-t border-gray-300 dark:border-DarkLightGrey" />
            
            <Link
              onClick={handleLinkClick}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey transition-colors"
              href="/profile"
            >
              Profilim
            </Link>

            <Link
              onClick={handleLinkClick}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey transition-colors"
              href="/profile/favoriler"
            >
              Favoriler
            </Link>

            <Link
              onClick={handleLinkClick}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey transition-colors"
              href="/profile/ayarlar"
            >
              Ayarlar
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey w-full text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Çıkış yapılıyor..." : "Güvenli Çıkış"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
