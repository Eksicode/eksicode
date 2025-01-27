import React from "react";

interface ButtonProps {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  children: React.ReactNode;
  style?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  variant = "primary",
  type = "button",
  children,
  style,
  disabled = false,
}) => {
  const variantClass = {
    primary:
      "bg-eksiCode text-gray-50 text-white border rounded-md text-sm hover:bg-white hover:text-eksiCode",
    secondary:
      "bg-white text-eksiCode text-eksiCode border rounded-md text-sm border-eksiCode text-sm hover:bg-eksiCode hover:text-white dark:bg-DarkerGrey dark:text-eksiCodeLight dark:border-eksiCode dark:hover:bg-white dark:hover:text-eksiCode",
    tertiary:
      "text-black border rounded-md text-sm hover:border hover:bg-eksiCode hover:text-white",
    quaternary:
      "text-dark text-sm rounded-md hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2 max-h-10 ${style} ${variantClass[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
