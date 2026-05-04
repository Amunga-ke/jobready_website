"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function CompanySearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    // Preserve industry param if present
    const industry = searchParams.get("industry");
    if (q) {
      router.push(`/companies?q=${encodeURIComponent(q)}${industry ? `&industry=${encodeURIComponent(industry)}` : ""}`);
    } else if (industry) {
      router.push(`/companies?industry=${encodeURIComponent(industry)}`);
    } else {
      router.push("/companies");
    }
  };

  const clearSearch = () => {
    setInputValue("");
    const industry = searchParams.get("industry");
    if (industry) {
      router.push(`/companies?industry=${encodeURIComponent(industry)}`);
    } else {
      router.push("/companies");
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-md">
      <div className="border border-divider rounded-lg px-3 py-2 flex items-center gap-2 bg-white">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search companies, industries..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 text-[13px] bg-transparent focus:outline-none placeholder-muted/60"
        />
        {inputValue && (
          <button type="button" onClick={clearSearch} className="text-muted hover:text-ink">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
