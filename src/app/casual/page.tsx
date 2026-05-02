'use client';

import { useState, useEffect } from 'react';
import { useJobModal } from '@/components/jobready/JobModalContext';
import { Search, MapPin, X, Hammer, AlertCircle } from 'lucide-react';
import type { CasualJobEntry } from '@/types';

/* ── Skeleton loader ── */
function SkeletonLine() {
  return (
    <div className="py-1 animate-pulse">
      <div className="h-3.5 bg-subtle rounded w-3/4" />
    </div>
  );
}

/* ── Main component ── */
export default function CasualPage() {
  const { openJobById } = useJobModal();
  const [jobs, setJobs] = useState<CasualJobEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    async function fetchCasualJobs() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch('/api/jobs?type=casual&limit=50');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error('[CasualPage] Fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCasualJobs();
  }, []);

  /* Filter logic */
  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchLocation;
  });

  /* Search submit */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setInputValue('');
  };

  /* Extract unique locations for filter */
  const uniqueLocations = Array.from(new Set(jobs.map((j) => j.location))).sort();

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-divider">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-bg rounded-xl flex items-center justify-center">
              <Hammer className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight">
                Casual & Part-Time Jobs
              </h1>
            </div>
          </div>
          <p className="text-[13px] text-muted ml-[52px]">
            Daily-wage, weekend, and flexible positions
          </p>
        </div>
      </div>

      {/* Search & filter bar */}
      <div className="border-b border-divider sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-5 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Keyword search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="border border-divider rounded-lg px-3 py-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Search by title, note..."
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

            {/* Location filter */}
            <div className="relative">
              <div className="border border-divider rounded-lg px-3 py-2 flex items-center gap-2 min-w-[160px]">
                <MapPin className="w-4 h-4 text-muted shrink-0" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="flex-1 text-[13px] bg-transparent focus:outline-none appearance-none text-muted cursor-pointer"
                >
                  <option value="">All locations</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {loading ? (
          <div className="bg-surface border border-divider rounded-xl p-5 sm:p-6">
            <div className="classifieds-text text-[12px] leading-[2.2]">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonLine key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">Failed to load listings</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              Something went wrong. Please try refreshing the page.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Hammer className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">No listings found</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              No casual jobs match your current filters. Try a different search or location.
            </p>
            {(searchQuery || locationFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setInputValue('');
                  setLocationFilter('');
                }}
                className="mt-4 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-surface border border-divider rounded-xl p-5 sm:p-6">
            <div className="classifieds-text text-[12px] leading-[2.2]">
              {filteredJobs.map((job, i) => (
                <div
                  key={job.id}
                  onClick={() => openJobById(job.id)}
                  className={`group cursor-pointer active:scale-[0.98] transition-transform rounded ${
                    i < filteredJobs.length - 1 ? 'border-b border-subtle pb-1' : ''
                  }`}
                >
                  <span className="text-ink group-hover:text-accent transition-colors">
                    {job.title}
                  </span>
                  <span className="text-muted/40"> — {job.location} — </span>
                  <span className="text-muted">{job.rate}</span>
                  <span className="text-muted/40"> — {job.note}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-subtle">
              <span className="font-mono text-[10px] text-muted/50">
                {filteredJobs.length} listing{filteredJobs.length !== 1 ? 's' : ''} shown
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
