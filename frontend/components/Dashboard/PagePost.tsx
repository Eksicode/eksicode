"use client";
import React, { useState, useEffect } from "react";
// import FileUpload from "@components/FileUpload";
import Button from "@components/Ui/Button";

interface Page {
  title: string;
  content: string;
  page_category: string;
  header_image: string;
  slug: string;
}

interface Categories {
  id?: number;
  name?: string;
  slug?: string;
  main_id?: number;
}

const PageForm: React.FC<{ initialData?: Page }> = ({ initialData }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState([] as Categories[]);
  //const [categories, setCategories] = useState<any[]>([]) ;


  const [page, setPage] = useState<Page>(
    initialData || {
      title: "",
      content: "",
      page_category: "",
      header_image: file ? URL.createObjectURL(file) : "",
      slug: "",
    }
  );

  useEffect(() => {
    const newSlug = page.title.trim() ? createSlug(page.title) : "";
    setPage((prevPage) => ({ ...prevPage, slug: newSlug }));
  }, [page.title]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setPage((prevPage) => ({ ...prevPage, page_category: value }));
  };
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setPage((prevPage) => ({ ...prevPage, [name]: value }));
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
      formData.append("title", page.title);
      formData.append("slug", page.slug);
      formData.append("page_category", page.page_category);
      formData.append("content", page.content);
      formData.append("header_image", file || "");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`, {
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

  const getCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/page-categories?count=total`
      );
      if (response.ok) {
        const fetchedCategories = await response.json();
        console.log(fetchedCategories);
        setCategories(fetchedCategories.data);
      } else {
        console.error("Failed to fetch categories:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);


  return (
    <form onSubmit={handleClick} className="flex flex-wrap">
      <div className="flex basis-1/2 flex-wrap pr-7 gap-1.5">
        <label htmlFor="title" className="text-sm font-medium flex basis-full">
          Başlık:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={page.title}
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
          value={page.slug}
          onChange={handleChange}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
        />

        <label htmlFor="page_category" className="text-sm font-medium w-full">
          Kategori:
        </label>

        <select
          id="page_category"
          name="page_category"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={page.page_category}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {categories?.map((category: any) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="header_image" className="text-sm font-medium w-full">
          Header Image:
        </label>
        {/* <FileUpload setFile={setFile} /> */}
        {file && <img src={URL.createObjectURL(file)} alt="Uploaded File" />}
      </div>
      <div className="flex basis-1/2 flex-col">
        <label htmlFor="content" className="text-sm font-medium">
          İçerik:
        </label>
        <textarea
          id="content"
          name="content"
          value={page.content}
          onChange={handleChange}
          className="rounded-md border border-gray-300 p-2 h-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end basis-full mt-10">
        <Button onClick={() => { }} type="submit" variant="primary" clasName="">
          Kaydet
        </Button>
      </div>
    </form>
  );
};

export default PageForm;
