'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReusableSearch from "@/components/Ui/ReusableSearch";

interface EtiketlerSearchProps {
  className?: string;
  placeholder?: string;
}

const EtiketlerSearch: React.FC<EtiketlerSearchProps> = ({ 
  className = "",
  placeholder = "Etiket ara..."
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (query.trim()) {
      params.set('search', query.trim());
      params.set('page', '1'); // Reset to first page when searching
    } else {
      params.delete('search');
      params.delete('page');
    }
    
    router.push(`/etiketler?${params.toString()}`);
  };

  return (
    <div className={className}>
      <ReusableSearch
        placeholder={placeholder}
        defaultValue={currentSearch}
        onSearch={handleSearch}
        className="w-full"
      />
    </div>
  );
};

export default EtiketlerSearch;
