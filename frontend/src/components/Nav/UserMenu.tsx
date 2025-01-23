import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    toggleMenu();
  };

  return (
    <div className="relative sm:hidden inline-block text-left z-50" ref={menuRef}>
      <div>
        <button onClick={toggleMenu} className="flex justify-center outline-none focus:outline-none focus:border-none">
          <span className="relative w-10 h-10 ml-2 overflow-hidden ring-2 ring-gray-300 bg-gray-100 rounded-full dark:bg-gray-600">
            <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-DarkerGrey ring-1 ring-eksiCode">
          <div className="py-1">
            <Link onClick={handleLinkClick} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey " href="#">@Mkltkn</Link>
            <hr className="border-t border-gray-300 hover:bg-gray-100" />
            <Link onClick={handleLinkClick} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey " href="/dashboard">Dashboard</Link>
            <Link onClick={handleLinkClick} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey " href="/dashboard/favoriler">Favoriler</Link>
            <Link onClick={handleLinkClick} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey " href="/dashboard/ayarlar">Ayarlar</Link>
            <form method="POST" action="#">
              <button onClick={handleLinkClick} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-DarkLightGrey  w-full text-left" type="submit">Güvenli Çıkış</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
