
import React, { useEffect, useCallback, useRef } from "react";
import Button from "@/components/Ui/Button";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && closeOnEscape) {
      onClose();
    }
  }, [onClose, closeOnEscape]);

  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose, closeOnBackdropClick]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      if (closeOnEscape) {
        document.addEventListener("keydown", handleEscapeKey);
      }
      // Focus management
      modalRef.current?.focus();
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      if (closeOnEscape) {
        document.removeEventListener("keydown", handleEscapeKey);
      }
    };
  }, [isOpen, handleEscapeKey, closeOnEscape]);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-full max-w-md";
      case "md":
        return "w-full max-w-lg";
      case "lg":
        return "w-full max-w-2xl";
      case "xl":
        return "w-full max-w-4xl";
      default:
        return "w-full max-w-lg";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/80"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`relative mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-700 ${getSizeClasses()}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t dark:border-gray-600">
            <h3 
              id="modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <AiOutlineClose className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
