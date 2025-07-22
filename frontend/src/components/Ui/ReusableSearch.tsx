'use client';

import React, { useState } from "react";

interface ReusableSearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  defaultValue?: string;
  autoFocus?: boolean;
}

const ReusableSearch: React.FC<ReusableSearchProps> = ({ 
  placeholder = "Ara",
  className = "",
  onSearch,
  onChange,
  defaultValue = "",
  autoFocus = false
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onChange?.(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(searchQuery);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        autoFocus={autoFocus}
        className="placeholder:text-gray-900 bg-white dark:placeholder:text-white dark:bg-DarkerGrey border-b border-eksiCode p-2.5 text-sm w-full focus:outline-none focus:border-eksiCode focus:border-b-2 transition-colors"
      />
    </form>
  );
};

export default ReusableSearch;
