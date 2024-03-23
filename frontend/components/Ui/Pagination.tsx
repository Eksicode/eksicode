import Navlink from "@components/Ui/NavLink";
import Link from "next/link";

export default function Pagination() {
  return (
    <div className="flex basis-full flex-wrap items-center justify-between px-4 py-3 sm:px-6">
      <div className="py-4 w-full px-1 mb-3 text-center">
        <Navlink variant={"tertiary"} href="/uye-ol">
          Daha Fazla Yükle
        </Navlink>
      </div>

      <div className="flex flex-1 w-full justify-center sm:hidden">
        <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <Link
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white  hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">En Baştaki Sayfa</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    className="st0"
                    d="M3.7,10.6L3.7,10.6C3.7,10.6,3.7,10.6,3.7,10.6l4.5,4.3c0,0,0,0,0,0c0.3,0.3,0.8,0.3,1.1-0.1
	c0.3-0.3,0.3-0.8-0.1-1.1l-3.9-3.7l0,0l3.9-3.7c0.3-0.3,0.3-0.8,0.1-1.1C9,5,8.5,5,8.2,5.2c0,0,0,0,0,0L3.7,9.5c0,0-0.2,0.2-0.2,0.5
	C3.5,10.4,3.7,10.6,3.7,10.6z"
                  />
                  <path
                    className="st0"
                    d="M7.8,10.6L7.8,10.6C7.8,10.6,7.8,10.6,7.8,10.6l4.5,4.3c0,0,0,0,0,0c0.3,0.3,0.8,0.3,1.1-0.1
	c0.3-0.3,0.3-0.8-0.1-1.1l-3.9-3.7l0,0l3.9-3.7c0.3-0.3,0.3-0.8,0.1-1.1C13.1,5,12.7,5,12.4,5.2c0,0,0,0,0,0L7.8,9.5
	c0,0-0.2,0.2-0.2,0.5C7.6,10.4,7.8,10.6,7.8,10.6z"
                  />
                  <path
                    className="st0"
                    d="M12,10.6L12,10.6C12,10.6,12,10.6,12,10.6l4.5,4.3c0,0,0,0,0,0c0.3,0.3,0.8,0.3,1.1-0.1
	c0.3-0.3,0.3-0.8-0.1-1.1l-3.9-3.7l0,0l3.9-3.7c0.3-0.3,0.3-0.8,0.1-1.1C17.3,5,16.8,5,16.5,5.2c0,0,0,0,0,0L12,9.5
	c0,0-0.2,0.2-0.2,0.5C11.7,10.4,12,10.6,12,10.6z"
                  />
                </svg>
              </Link>
              <Link
                href="#"
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Onceki</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="#"
                aria-current="page"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-200 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                1
              </Link>
              <Link
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                2
              </Link>
              <Link
                href="#"
                className="relative items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0 md:inline-flex"
              >
                3
              </Link>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
              <Link
                href="#"
                className="relative items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0 md:inline-flex"
              >
                100
              </Link>
              <Link
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                101
              </Link>
              <Link
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                102
              </Link>

              <Link
                href="#"
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Sonraki Sayfa</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:text-white hover:bg-eksiCode focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">En Son Sayfa</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    className="st0"
                    d="M17.5,9.5L17.5,9.5C17.5,9.5,17.5,9.5,17.5,9.5L13,5.3c0,0,0,0,0,0C12.7,5,12.2,5,11.9,5.3
	c-0.3,0.3-0.3,0.8,0.1,1.1l3.9,3.7l0,0l-3.9,3.7c-0.3,0.3-0.3,0.8-0.1,1.1c0.3,0.3,0.8,0.3,1.1,0.1c0,0,0,0,0,0l4.5-4.2
	c0,0,0.2-0.2,0.2-0.5C17.7,9.7,17.5,9.5,17.5,9.5z"
                  />
                  <path
                    className="st0"
                    d="M13.4,9.5L13.4,9.5C13.4,9.5,13.4,9.5,13.4,9.5L8.9,5.3c0,0,0,0,0,0C8.5,5,8.1,5,7.8,5.3
	C7.5,5.6,7.5,6.1,7.8,6.4l3.9,3.7l0,0l-3.9,3.7c-0.3,0.3-0.3,0.8-0.1,1.1c0.3,0.3,0.8,0.3,1.1,0.1c0,0,0,0,0,0l4.5-4.2
	c0,0,0.2-0.2,0.2-0.5C13.6,9.7,13.4,9.5,13.4,9.5z"
                  />
                  <path
                    className="st0"
                    d="M9.2,9.5L9.2,9.5C9.2,9.5,9.2,9.5,9.2,9.5L4.7,5.3c0,0,0,0,0,0C4.4,5,3.9,5,3.7,5.3C3.4,5.6,3.4,6.1,3.7,6.4
	l3.9,3.7l0,0l-3.9,3.7c-0.3,0.3-0.3,0.8-0.1,1.1c0.3,0.3,0.8,0.3,1.1,0.1c0,0,0,0,0,0l4.5-4.2c0,0,0.2-0.2,0.2-0.5
	C9.5,9.7,9.2,9.5,9.2,9.5z"
                  />
                </svg>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <p className="text-xs text-center w-full text-gray-400 mt-4">
        Toplam 1020 sonucun, 1 ila 10 arası gösteriliyor
      </p>
    </div>
  );
}
