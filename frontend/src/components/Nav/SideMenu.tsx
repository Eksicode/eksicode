'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as md from "react-icons/md";
import * as Ai from "react-icons/ai";
import Link from "next/link";
import getData from "@/utils/getData";

interface Menu {
  id: number;
  name: string;
  link: string;
  subMenu: number;
  icon: string;
}

interface MenuResponse {
  data: Menu[];
  meta: any;
  message: string;
}

const IconMap = {
  ...md,
  ...Ai,
};

const getIconComponent = (iconName: string): React.ComponentType | null => {
  const IconComponent = IconMap[iconName as keyof typeof IconMap];
  return IconComponent || null;
};

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for menu data
let menuCache: { data: Menu[]; timestamp: number } | null = null;

function SideMenu() {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    if (!menuCache) return false;
    return Date.now() - menuCache.timestamp < CACHE_DURATION;
  }, []);

  const fetchMenuWithRetry = useCallback(async (attempt = 1): Promise<void> => {
    try {
      setError(null);
      
      // Use cached data if available and valid
      if (isCacheValid && menuCache) {
        setMenu(menuCache.data);
        setRetryCount(0);
        setLoading(false);
        return;
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      const fetchedMenu = await getData<Menu>("menus", true, 0, 0, 0, { 
        cache: "no-cache" 
      });

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // Validate response structure
      if (!fetchedMenu || !Array.isArray(fetchedMenu.data)) {
        throw new Error("Geçersiz yanıt yapısı");
      }

      const menuData = fetchedMenu.data.map((item: any) => {
        // Validate each menu item
        if (!item || typeof item !== 'object') {
          console.warn('Invalid menu item:', item);
          return null;
        }
        return {
          id: item.id || 0,
          name: item.name || "İsimsiz Menü",
          icon: item.icon || "MdMenu", // Fallback icon
          link: item.link || "#",
          subMenu: item.subMenu || 0,
        };
      }).filter((item): item is Menu => item !== null);
      
      // Update cache
      menuCache = {
        data: menuData,
        timestamp: Date.now()
      };
      
      setMenu(menuData);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      // Don't set error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.error(`Error fetching menu (attempt ${attempt}):`, error);
      
      if (attempt < RETRY_ATTEMPTS) {
        setRetryCount(attempt);
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        timeoutRef.current = setTimeout(() => {
          fetchMenuWithRetry(attempt + 1);
        }, delay);
      } else {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Bilinmeyen bir hata oluştu";
        setError(`Menü yüklenirken bir hata oluştu: ${errorMessage}. Sayfayı yenilemeyi deneyin.`);
        setRetryCount(0);
      }
    }
  }, [isCacheValid]);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      await fetchMenuWithRetry();
    } finally {
      setLoading(false);
    }
  }, [fetchMenuWithRetry]);

  useEffect(() => {
    fetchMenu();

    // Cleanup function
    return () => {
      // Clear timeout if component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Abort ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMenu]);

  const handleRetry = useCallback(() => {
    // Clear cache on manual retry
    menuCache = null;
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setRetryCount(0);
    fetchMenu();
  }, [fetchMenu]);

  // Memoized loading component
  const LoadingComponent = useMemo(() => (
    <aside className="w-64 hidden lg:block" aria-label="Sidebar">
      <div className="overflow-y-auto w-64 py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/5"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/3"></div>
        </div>
        <div className="text-sm font-semibold text-gray-500 mt-4">
          Menü yükleniyor...
          {retryCount > 0 && (
            <div className="text-xs mt-1">
              Yeniden deneniyor... ({retryCount}/{RETRY_ATTEMPTS})
            </div>
          )}
        </div>
      </div>
    </aside>
  ), [retryCount]);

  // Memoized error component
  const ErrorComponent = useMemo(() => (
    <aside className="w-64 hidden lg:block" aria-label="Sidebar">
      <div className="overflow-y-auto w-64 py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <md.MdError className="text-2xl mx-auto" />
          </div>
          <span className="text-sm font-semibold text-gray-500 block mb-3">
            {error}
          </span>
          <button
            onClick={handleRetry}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    </aside>
  ), [error, handleRetry, loading]);

  // Memoized menu items
  const MenuItems = useMemo(() => (
    <ul className="space-y-2">
      {menu.length === 0 ? (
        <li className="text-center">
          <span className="text-sm font-semibold text-gray-500">
            Menü bulunamadı
          </span>
        </li>
      ) : (
        menu.map((item) => {
          const IconComponent = getIconComponent(item.icon);
          return (
            <li key={item.id}>
              <Link
                href={item.link}
                className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey transition-colors"
              >
                {IconComponent ? (
                  React.createElement(IconComponent as any, { 
                    className: "text-lg flex-shrink-0" 
                  })
                ) : (
                  <md.MdMenu className="text-lg flex-shrink-0" />
                )}
                <span className="ml-3 truncate">{item.name}</span>
              </Link>
            </li>
          );
        })
      )}
    </ul>
  ), [menu]);

  if (loading) {
    return LoadingComponent;
  }

  if (error) {
    return ErrorComponent;
  }

  return (
    <aside className="w-64 hidden lg:block" aria-label="Sidebar">
      <div className="overflow-y-auto min-h-96 w-64 py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
        {MenuItems}
      </div>
    </aside>
  );
}

export default SideMenu;
