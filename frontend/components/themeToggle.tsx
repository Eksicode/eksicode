"use client";

import React from "react";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

function ThemeToggle() {
  const [darkMode, setdarkMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setdarkMode(true);
    } else {
      setdarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
    <button 
    title="Toggle Theme" 
    onClick={() => setdarkMode(!darkMode)}
    className="
        w-12 
        h-6 
        rounded-full
        mt-0.5
        p-1 
        bg-gray-200 
        dark:bg-gray-600 
        relative 
        transition-colors 
        duration-500 
        ease-in
        focus:ring-gray-700 
        dark:focus:ring-gray-600 
        focus:border-transparent
      ">
        <FaMoon className="block absolute mt-0.5 text-white" size={12} />
      <div id="toggle"
        className="
            rounded-full 
            w-4 
            h-4
            z-50
            bg-gray-600 
            dark:bg-gray-500 
            relative 
            ml-0 
            dark:ml-6 
            pointer-events-none 
            transition-all 
            duration-300 
            ease-out
        ">
      </div>
      <BsSunFill className="block absolute z-10 mt-1.5 mr-1 text-yellow-400 right-0 top-0" size={12} />

</button>
    </>
    // <div
    //   className="relative w-16 h-8 items-center dark:bg-gray-900 bg-teal-500 cursor-pointer rounded-full p-1"
    //   onClick={() => setdarkMode(!darkMode)}
    // >
    //   <FaMoon className=" text-white" size={18} />
    //   <div
    //     className="absolute w-6 h-6 z-10 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md transform transition-transform duration-300"
    //     style={darkMode ? { left: "2px" } : { right: "2px" }}
    //   ></div>
    //   <BsSunFill className="text-yellow-400 ml-auto" size={18} />
    // </div>
  );
}

export default ThemeToggle;