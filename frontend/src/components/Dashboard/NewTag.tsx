"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Ui/Button";

interface Tag {
  name: string;
  description: string;
  icon: string;
  slug: string;
}

const NewTag: React.FC<{ initialData?: Tag }> = ({ initialData }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  //const [categories, setCategories] = useState<any[]>([]) ;


  const [tag, setTag] = useState<Tag>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      icon: "",
    }
  );

  useEffect(() => {
    const newSlug = tag.name.trim() ? createSlug(tag.name) : "";
    setTag((prevPage) => ({ ...prevPage, slug: newSlug }));
  }, [tag.name]);


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setTag((prevPage) => ({ ...prevPage, [name]: value }));
  };

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
      formData.append("name", tag.name);
      formData.append("slug", tag.slug);
      formData.append("description", tag.description);
      formData.append("icon", tag.icon);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Form submission successful!");
      } else {
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };
  const createSlug = (title: string) => {
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

    return title
      .toLowerCase()
      .replace(/[çğıöşü]/g, (match) => turkishCharacters[match])
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  return (
    <form onSubmit={handleClick} className="flex flex-wrap">
      <div className="flex basis-1/2 flex-wrap pr-7 gap-1.5">
        <label htmlFor="name" className="text-sm font-medium flex basis-full">
          Başlık:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={tag.name}
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
          value={tag.slug}
          onChange={handleChange}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
        />

        <label htmlFor="icon" className="text-sm font-medium w-full">
          Icon:
        </label>
        <input
          type="text"
          id="Icon"
          name="icon"
          value={tag.icon}
          onChange={handleChange}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 basis-full"
        />

      </div>
      <div className="flex basis-1/2 flex-col">
        <label htmlFor="description" className="text-sm font-medium">
          İçerik:
        </label>
        <textarea
          id="description"
          name="description"
          value={tag.description}
          onChange={handleChange}
          className="rounded-md border border-gray-300 p-2 h-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end basis-full mt-10">
        <Button onClick={() => { }} variant="primary" type="submit" clasName="">
          Kaydet
        </Button>
      </div>
    </form>
  );
};

export default NewTag;
