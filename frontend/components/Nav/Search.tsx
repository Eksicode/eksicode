import React from 'react'
import { AiOutlineSearch } from "react-icons/ai";

const Search = () => {
  return (
    <div className="flex justify-center w-1/3 sm:w-full">
    <div className="relative text-gray-600 w-full">
      <input
        className="border-2 w-full border-gray-300 bg-white h-10 pl-2 pr-8 focus:ring-eksiCode focus:border-eksiCode rounded-lg text-sm focus:outline-none"
        name="search"
        placeholder="Ara..."
        required
      />
      <button type="submit" className="absolute right-0 top-0 w-8 h-10">
        <AiOutlineSearch />
      </button>
    </div>
  </div>
  )
}

export default Search

