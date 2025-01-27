"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchFormProps {
  initialTerm?: string;
}

const Search: React.FC<SearchFormProps> = ({
  initialTerm = "",
}: SearchFormProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchTerm)}`);
    }
    setSearchTerm("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative text-gray-600 w-full">
      <input
        type="search"
        placeholder="Gönderi, yazar, etiket ara..."
        className="border w-full border-gray-500 bg-white dark:bg-gray-300 dark:placeholder:text-dark h-10 pl-2 pr-8 focus:ring-eksiCode focus:border-eksiCode rounded-lg text-sm focus:outline-none"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        required
      />
      <button
        type="submit"
        onKeyDown={handleSubmit}
        className="absolute right-0 top-0 w-8 h-10"
      >
        <AiOutlineSearch />
      </button>
    </form>
  );
};

export default Search;
