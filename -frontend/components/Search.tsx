import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Props {
  text: string;
}

const Search: React.FC<Props> = ({ text }) => {
  return (
    <div className="relative text-gray-600 w-full">
      <input
        className="border w-full border-gray-300 bg-white h-10 pl-2 pr-8 focus:ring-eksiCode focus:border-eksiCode rounded-lg text-sm focus:outline-none"
        name="search"
        placeholder={text}
        required
      />
      <button type="submit" className="absolute right-0 top-0 w-8 h-10">
        <AiOutlineSearch />
      </button>
    </div>
  );
};

export default Search;
