'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReusableSearch from "@/components/Ui/ReusableSearch";

interface SourcesSearchProps {
  className?: string;
  placeholder?: string;
}

const SourcesSearch: React.FC<SourcesSearchProps> = ({ 
  className = "",
  placeholder = "Kaynak ara..."
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
    
    router.push(`/kaynaklar?${params.toString()}`);
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

export default SourcesSearch;
