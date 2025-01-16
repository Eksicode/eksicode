import React, { useState, useEffect } from "react";
import Button from "@components/Ui/Button";
import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";

interface Menu {
  name: string;
  slug: string;
  main: string;
  icon: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  buttonText?: string;
  redUrl?: string;
  initialData?: Menu
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  buttonText,
  redUrl,
  initialData
}) => {
  const router = useRouter();
  const [menu, setMenu] = useState<Menu>(
    initialData || {
      name: "",
      slug: "",
      main: "",
      icon: "",
    }
  );

  useEffect(() => {
    const newSlug = menu.name.trim() ? createSlug(menu.name) : "";
    setMenu((prevPage) => ({ ...prevPage, slug: newSlug }));
  }, [menu.name]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setMenu((prevPage) => ({ ...prevPage, [name]: value }));
  };

  if (!isOpen) return null


  const handleClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const tokenResponse = await fetch('/api');
      const data = await tokenResponse.json();

      const token = data.token;
      if (!token) {
        console.error('Token is not available.');
        return;
      }
      const formData = new FormData();
      formData.append("name", menu.name);
      formData.append("slug", menu.slug);
      formData.append("main", menu.main);
      formData.append("icon", menu.icon);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Form submission successful!");
        onClose();
        if (redUrl) router.push(redUrl);
      } else {
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const createSlug = (name: string) => {
    const turkishCharacters: { [key: string]: string } = {
      ç: "c",
      ğ: "g",
      ı: "i",
      ö: "o",
      ş: "s",
      ü: "u",
      Ç: "C",
      Ğ: "G",
      İ: "I",
      Ö: "O",
      Ş: "S",
      Ü: "U",
    };

    return name
      .toLowerCase()
      .replace(/[çğıöşü]/g, (match) => turkishCharacters[match])
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  return (
    <div className="fixed w-screen h-screen overflow-y-auto overflow-x-hidden top-0 right-0 left-0 bg-gray-800/80 m-0 p-0 z-10">
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center w-full">
            {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
            <Button onClick={onClose} variant="primary">
              <AiOutlineClose />
            </Button>
          </div>
          <form onSubmit={handleClick} className="flex flex-wrap w-full">
            <div className="flex basis-1/2 flex-wrap pr-7 gap-1.5">
              <label htmlFor="name" className="text-sm font-medium flex basis-full">
                Başlık:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={menu.name}
                onChange={handleChange}
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 basis-full"
              />
              <label htmlFor="slug" className="text-sm font-medium w-full">
                Slug:
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={menu.slug}
                onChange={handleChange}
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex basis-1/2 flex-col h-fit">
              <label htmlFor="Icon" className="text-sm font-medium w-full mb-[5px]">
                Icon:
              </label>
              <input
                type="text"
                id="Icon"
                name="icon"
                value={menu.icon}
                onChange={handleChange}
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 basis-full"
              />
            </div>
            <div className="flex justify-end basis-full mt-10">
              {buttonText && (
                <Button onClick={() => { }} type="submit" variant="primary" clasName="w-full">
                  {buttonText}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;


