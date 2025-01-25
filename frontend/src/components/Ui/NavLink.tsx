import React from "react";
import Link from "next/link";

interface LinkProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  children: React.ReactNode;
  style?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

const Navlink: React.FC<LinkProps> = ({
  variant = "primary",
  children,
  style,
  href,
  target = "_self",
}) => {
  const variantClass = {
    primary: "bg-eksiCode text-gray-50 text-white border rounded-md text-sm hover:bg-white hover:text-eksiCode",
    secondary: "bg-white text-eksiCode text-eksiCode border rounded-md text-sm border-eksiCode text-sm hover:bg-eksiCode hover:text-white dark:bg-DarkerGrey dark:text-eksiCodeLight dark:border-eksiCode dark:hover:bg-white dark:hover:text-eksiCode transition duration-300 ease-in-out",
    tertiary: "text-black border rounded-md text-sm hover:border hover:bg-eksiCode hover:text-white ark:bg-DarkerGrey dark:text-eksiCodeLight dark:border-eksiCode dark:hover:bg-white dark:hover:text-eksiCode transition duration-300 ease-in-out",
    quaternary: "text-dark text-sm rounded-md hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode dark:bg-DarkerGrey dark:text-eksiCodeLight dark:border-DarkGrey dark:hover:border dark:hover:border-eksiCodeLight dark:hover:text-eksiCode transition duration-300 ease-in-out"
  };
  if (typeof href === "string") {
    return (
      <Link
        className={`p-2 ${style} ${variantClass[variant]}`}
        href={href}
        target={target}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <Link
        className={`p-2 ${style} ${variantClass[variant]}`}
        href="#"
        target={target}
      >
        {children}
      </Link>
    )
  }
};

export default Navlink;
