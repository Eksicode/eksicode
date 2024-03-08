"use client";
import React, { useState, useEffect } from "react";
import FileUpload from "@components/FileUpload";

interface Page {
  title: string;
  image: string;
  content: string;
  slug: string;
  category: string;
  page_category_id: string;
}

const PageForm: React.FC<{ initialData?: Page }> = ({ initialData }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [page, setPage] = useState<Page>(
    initialData || {
      title: "",
      image: file ? URL.createObjectURL(file) : "",
      content: "",
      category: "",
      slug: "",
      page_category_id: "",
    }
  );

  useEffect(() => {
    const newSlug = page.title.trim() ? createSlug(page.title) : "";
    setPage((prevPage) => ({ ...prevPage, slug: newSlug }));
  }, [page.title]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setPage((prevPage) => ({ ...prevPage, category: value }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setPage((prevPage) => ({ ...prevPage, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("title", page.title);
      formData.append("slug", page.slug);
      formData.append("category", page.category);
      formData.append("content", page.content);
      formData.append("page_category_id", page.page_category_id); // Assuming this is included
      formData.append("image", file || ""); // Provide a default value for the image field
      const response = await fetch("http://127.0.0.1:8000/api/pages", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });

      if (response.ok) {
        console.log("Form submission successful!");
        // Handle success, e.g., clear form fields or redirect
      } else {
        console.error("Form submission failed:", response.statusText);
        // Handle failure, e.g., display an error message
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      // Handle errors, e.g., display a generic error message
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

  const getToken = async () => {
    const fetchedToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MDk5MTcxMjAsImV4cCI6MTcwOTkyMDcyMCwibmJmIjoxNzA5OTE3MTIwLCJqdGkiOiJaVnBHM3NyQWVsaUNCdW5nIiwic3ViIjoiNiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.cHqGomkqVfoU7HMEs9tQUDpyYgx-ok8kpRr4i8c-fJ0"; // Replace with actual token retrieval logic
    setToken(fetchedToken);
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap">
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

        <label htmlFor="category" className="text-sm font-medium w-full">
          Kategori:
        </label>

        <select
          id="category"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>

        <label htmlFor="image" className="text-sm font-medium w-full">
          Header Image:
        </label>
        <FileUpload setFile={setFile} />
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
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
};

export default PageForm;
