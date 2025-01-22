"use client";;
import React from "react";
import Link from "next/link";
import Navlink from "@/components/Ui/NavLink";

interface PaginationProps {
  activePage: number;
  totalPages: number;
}

interface PaginationProps {
  activePage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  activePage,
  totalPages
}: PaginationProps) => {
  const generatePageLink = (page: number) => `/?page=${page}`;

  const currentPage: number = Number(activePage);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const startPage: number = Number(Math.max(currentPage - 2, 1));
    const endPage: number = Number(Math.min(startPage + 4, totalPages));

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) pages.unshift("...");
    if (endPage < totalPages) pages.push("...");

    return pages;
  };

  const visiblePages = getVisiblePages();

  const randomKey = () => Math.random().toString(36).substring(7);

  const renderPageLink = (page: number | string, isActive: boolean) => {
    if (typeof page === "number") {
      return (
        <li key={randomKey()}>
          <Link
            href={generatePageLink(page)}
            className={`hidden md:flex items-center justify-center px-3 h-8 leading-tight border ${
              isActive
                ? "bg-gray-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {page}
          </Link>
        </li>
      );
    }
    return (
      <li key={randomKey()}>
        <span className="flex items-center justify-center px-3 h-8 leading-tight border bg-white text-gray-600">
          {page}
        </span>
      </li>
    );
  };

  const renderNavigationButton = (
    label: string,
    page: number | null,
    disabled: boolean
  ) => {
    const baseClasses =
      "flex items-center justify-center px-3 h-8 leading-tight border rounded-sm";
    const disabledClasses = "bg-gray-200 text-gray-600 cursor-not-allowed";
    const activeClasses =
      "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700";

    if (disabled) {
      return (
        <li>
          <span
            className={`${baseClasses} ${disabledClasses}`}
            aria-disabled="true"
          >
            {label}
          </span>
        </li>
      );
    }

    return (
      <li>
        <Link
          href={generatePageLink(page!)}
          className={`${baseClasses} ${activeClasses}`}
        >
          {label}
        </Link>
      </li>
    );
  };

  const handleManualPage = () => {
    const manualPage = Number(
      (document.getElementById("manualPage") as HTMLInputElement)?.value
    );
    if (manualPage > 0 && manualPage <= totalPages) {
      window.location.href = generatePageLink(manualPage);
    }
  };

  return (
    <div className="w-full flex justify-center flex-wrap mt-10">
      <div className="py-4 w-full px-1 mb-1 text-center">
        <Navlink variant={"tertiary"} href={ generatePageLink(currentPage + 1)}>
          Daha Fazla Yükle
        </Navlink>
      </div>

      <nav
        className="w-full flex justify-center mt-2"
        aria-label="Page navigation"
      >
        <ul className="inline-flex -space-x-px text-sm">
          {renderNavigationButton("<< İlk", 1, currentPage === 1)}
          {renderNavigationButton(
            "< Önceki",
            currentPage - 1,
            currentPage === 1
          )}

          {visiblePages.map((page) =>
            renderPageLink(page, currentPage === page)
          )}

          {renderNavigationButton(
            "Sonraki >",
            currentPage + 1,
            currentPage === totalPages
          )}
          {renderNavigationButton(
            "Son >>",
            totalPages,
            currentPage === totalPages
          )}
        </ul>
      </nav>
      <div className="flex items-center mt-5 text-sm text-zinc-500 mb-10">
        {`Sayfa `}
        <input
          type="string"
          id="manualPage"
          placeholder={currentPage.toString()}
          className="w-8 mx-2 bg-trandparent border-gray-600 border-2 text-center"
        />
        {` / ${totalPages}`}
        <button
          className="flex items-center justify-center px-2 h-6 leading-tight border bg-gray-300 rounded-sm ml-2"
          onClick={handleManualPage}
        >
          Git
        </button>
      </div>
    </div>
  );
};

export default Pagination;
