import React from "react";

interface ButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  children: React.ReactNode;
  clasName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  variant = "primary",
  type = "button",
  children,
  clasName,
  disabled = false,
}) => {
  const variantClass = {
    primary:
      "bg-eksiCode text-gray-50 text-white border rounded-md text-sm hover:bg-white hover:text-eksiCode",
    secondary:
      "bg-white text-eksiCode text-eksiCode border rounded-md text-sm border-eksiCode text-sm hover:bg-eksiCode hover:text-white",
    tertiary:
      "text-black border rounded-md text-sm hover:border hover:bg-eksiCode hover:text-white",
    quaternary:
      "text-dark text-sm rounded-md hover:border hover:border-eksiCode rounded-lg hover:text-eksiCode",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2 ${clasName} ${variantClass[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
