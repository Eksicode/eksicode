"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Ui/Button";

interface Role {
  name: string;
  description: string;
}

const NewRole: React.FC<{ initialData?: Role }> = ({ initialData }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  //const [categories, setCategories] = useState<any[]>([]) ;

  const [role, setRole] = useState<Role>(
    initialData || {
      name: "",
      description: "",
    }
  );


  useEffect(() => {
    const newSlug = role.name.trim() ? createSlug(role.name) : "";
    setRole((prevPage) => ({ ...prevPage, slug: newSlug }));
  }, [role.name]);


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setRole((prevPage) => ({ ...prevPage, [name]: value }));
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
      formData.append('name', role.name);
      formData.append('description', role.description);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log('Form submission successful!');
      } else {
        console.error('Form submission failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
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
          value={role.name}
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
          value={role.description}
          onChange={handleChange}
          className="rounded-md border border-gray-300 p-2 h-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end basis-full mt-10">
        <Button onClick={() => {}} variant="primary" type="submit">
          Kaydet
        </Button>
      </div>
    </form>
  );
};

export default NewRole;
