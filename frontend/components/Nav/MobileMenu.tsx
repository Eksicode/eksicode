import React from "react";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const MobileMenu = () => {
  
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
      {/*  Hamburger Menu Icon */}
      <div onClick={handleNav} className="sm:block hidden cursor-pointer">
        <AiOutlineMenu size={25} className="m-6 text-dark" />
      </div>
      {/*  Mobile menu */}
      <div
        className={
          nav ? "md:hidden fixed left-0 top-0 w-full h-full bg-dark/70" : " "
        }
      >
        <div
          className={
            nav
              ? "fixed right-0 top-0 w-[75%] ease-in duration-500 xl:w-[35%] sm:w-[50%] md:w-[45%] h-full bg-menu"
              : "fixed right-[-100%] top-0 ease-in duration-500 h-full bg-menu"
          }
        >
          <div className="flex w-full items-end justify-end">
            <div
              onClick={handleNav}
              className="rounded-full shadow-lg shadow-gray-400 p-2 mr-5 mt-5 cursor-pointer"
            >
              <AiOutlineClose />
            </div>
          </div>

          {/*  Mobile Menu */}
          <div className="flex flex-col items-end mt-5 mx-5 py-4 z-20 ">
            Mobile Menu
            <div className="mt-20 flex items-center justify-around my-10 ml-2 w-full sm:w-[80%]">
              <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 text-eksi">
                <FaGithub />
              </div>
              <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 text-eksi">
                <FaTwitter />
              </div>
              <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 text-eksi">
                <FaDiscord />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
