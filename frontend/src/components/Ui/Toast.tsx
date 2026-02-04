"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  /** Duration in ms; default by type: error 6000, warning 4000, success 3000, info 2500 */
  duration?: number;
}

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3000,
  error: 6000,
  warning: 4000,
  info: 2500,
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  duration,
}) => {
  const ms = duration ?? DEFAULT_DURATION[type];

  useEffect(() => {
    const timer = setTimeout(() => onClose(), ms);
    return () => clearTimeout(timer);
  }, [onClose, ms]);

  const style = (() => {
    switch (type) {
      case "success":
        return "bg-green-600 dark:bg-green-700";
      case "error":
        return "bg-red-600 dark:bg-red-700";
      case "warning":
        return "bg-amber-600 dark:bg-amber-700";
      case "info":
      default:
        return "bg-blue-600 dark:bg-blue-700";
    }
  })();

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`${style} fixed top-20 right-4 sm:right-10 p-4 rounded-lg text-white z-[100] shadow-lg flex items-center gap-3 max-w-md`}
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Bildirimi kapat"
      >
        <IoClose className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
