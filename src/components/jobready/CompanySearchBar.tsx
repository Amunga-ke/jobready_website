"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function CompanySearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(initialQuery);

  // Debounce the input value to avoid rapid navigation on every keystroke
  const debouncedQuery = useDebounce(inputValue, 400);

  // Build the search URL helper
  const buildSearchUrl = useCallback(
    (q: string) => {
      const industry = searchParams.get("industry");
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (industry) params.set("industry", industry);
      const qs = params.toString();
      return qs ? `/companies?${qs}` : "/companies";
    },
    [searchParams]
  );

  // Navigate automatically when the debounced query changes
  useEffect(() => {
    // Only auto-navigate if the debounced value differs from the initial URL query
    const urlQuery = searchParams.get("q") || "";
    if (debouncedQuery !== initialQuery || debouncedQuery !== urlQuery) {
      // Navigate to debounced search URL
      const url = buildSearchUrl(debouncedQuery.trim());
      router.replace(url);
    }
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    const url = buildSearchUrl(q);
    router.push(url);
  };

  const clearSearch = () => {
    setInputValue("");
    const url = buildSearchUrl("");
    router.push(url);
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
