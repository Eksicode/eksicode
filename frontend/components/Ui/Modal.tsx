import React from "react";
import Button from "@components/Ui/Button";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  buttonText?: string;
  redUrl?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  text,
  buttonText,
  redUrl,
}) => {
  const router = useRouter();

  if (!isOpen) return null;


  const clickHandler = () => {
    onClose();
    if (redUrl) router.push(redUrl);
  };

  return (
    <div className="fixed w-screen h-screen overflow-y-auto overflow-x-hidden top-0 right-0 left-0 bg-gray-800/80 m-0 p-0 z-10">
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
          {text && <p className="mb-4">{text}</p>}
          {buttonText && (
            <Button onClick={clickHandler} variant="primary" clasName="w-full">
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
