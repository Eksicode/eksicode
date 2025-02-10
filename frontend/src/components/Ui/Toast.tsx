"use client";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info"; 
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500); 

    return () => clearTimeout(timer); 
  }, [onClose]);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "info":
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div
      className={`${getBgColor()} fixed top-20 right-10 p-5 rounded-md text-white z-50`}
    >
      <span>{message}</span>
      <button className="ml-4" onClick={onClose}>
        <IoClose />
      </button>
    </div>
  );
};

export default Toast;
