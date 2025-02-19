"use client"
import React from "react";
import Link from "next/link";

function Notifications() {
  return (
    <>
      <Link
        className="inline-block relative mx-1"
        href="/dashboard/bildirimler"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="sm:h-6 sm:w-6 h-8 w-8 hover:text-eksiCode text-dark dark:text-gray-300 dark:hover:text-eksiCode transition duration-300 ease-in-out text-4xl"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-green-800 bg-eksiCode"></span>
      </Link>
    </>
  );
}

export default Notifications;
