import React from "react";
import Link from "next/link";

interface LinkProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  children: React.ReactNode;
  clasName?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

const Navlink: React.FC<LinkProps> = ({
  variant = "primary",
  children,
  clasName,
  href,
  target = "_self",
}) => {
  const variantClass = {
    primary: "bg-eksiCode text-gray-50 text-white border rounded-md text-sm hover:bg-white hover:text-eksiCode",
    secondary: "bg-white text-eksiCode text-eksiCode border rounded-md text-sm border-eksiCode text-sm hover:bg-eksiCode hover:text-white",
    tertiary: "text-black border rounded-md text-sm hover:border hover:bg-eksiCode hover:text-white",
    quaternary: "text-dark text-sm rounded-md hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode"
  };
  if (typeof href === "string") {
    return (
      <Link
        className={`p-2 ${clasName} ${variantClass[variant]}`}
        href={href}
        target={target}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <Link
        className={`p-2 ${clasName} ${variantClass[variant]}`}
        href="#"
        target={target}
      >
        {children}
      </Link>
    )
  }
};

export default Navlink;
