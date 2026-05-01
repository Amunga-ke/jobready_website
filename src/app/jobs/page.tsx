'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useJobModal } from '@/components/fursa/JobModalContext';
import { Search, X, Building2, MapPin, Clock, Briefcase, ChevronDown, Loader2 } from 'lucide-react';
import type { Job } from '@/types';

/* ── Filter chip config ── */
interface FilterGroup {
  key: string;
  label: string;
  options: { value: string; display: string }[];
  param: string;
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'workMode',
    label: 'Work Mode',
    options: [
      { value: 'REMOTE', display: 'Remote' },
      { value: 'HYBRID', display: 'Hybrid' },
      { value: 'ONSITE', display: 'On-site' },
    ],
    param: 'workMode',
  },
  {
    key: 'level',
    label: 'Level',
    options: [
      { value: 'ENTRY_LEVEL', display: 'Entry' },
      { value: 'MID_LEVEL', display: 'Mid' },
      { value: 'SENIOR', display: 'Senior' },
      { value: 'EXECUTIVE', display: 'Executive' },
    ],
    param: 'level',
  },
  {
    key: 'employmentType',
    label: 'Type',
    options: [
      { value: 'FULL_TIME', display: 'Full-time' },
      { value: 'PART_TIME', display: 'Part-time' },
      { value: 'CONTRACT', display: 'Contract' },
    ],
    param: 'employmentType',
  },
];

/* ── Skeleton loader ── */
function CardSkeleton() {
  return (
    <div className="border-b border-subtle py-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-subtle rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-subtle rounded w-3/4" />
          <div className="h-3 bg-subtle rounded w-1/2" />
          <div className="flex gap-3 mt-2">
            <div className="h-3 bg-subtle rounded w-16" />
            <div className="h-3 bg-subtle rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Job card component ── */
function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const meta: string[] = [];
  if (job.type) meta.push(job.type);
  if (job.level && job.level !== 'Any') meta.push(job.level);
  if (job.location) meta.push(job.location);

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer border-b border-subtle py-4 active:scale-[0.98] transition-transform ${
        job.isFeatured ? 'border-l-2 border-l-accent pl-4 ml-0 sm:ml-[-6px]' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 border border-divider rounded-lg flex items-center justify-center shrink-0 font-heading font-bold text-sm text-muted bg-surface">
          {job.companyInitial || job.company?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium group-hover:text-accent transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-[12px] text-muted mt-0.5 flex items-center gap-1.5">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{job.company}</span>
            {job.location && (
              <>
                <MapPin className="w-3 h-3 shrink-0 ml-2" />
                <span className="truncate">{job.location}</span>
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {meta.map((m, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px] text-muted">
                <Briefcase className="w-3 h-3" />
                {m}
              </span>
            ))}
            {job.salary && job.salary !== 'Competitive' && job.salaryCurrency && (
              <span className="text-[11px] font-medium text-ink">
                {job.salaryCurrency} {job.salary}
              </span>
            )}
            {job.posted && (
              <span className="flex items-center gap-1 text-[11px] text-muted ml-auto">
                <Clock className="w-3 h-3" />
                {job.posted}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main content (needs Suspense boundary for useSearchParams) ── */
function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openJobById } = useJobModal();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  /* Read URL params */
  const workMode = searchParams.get('workMode') || '';
  const level = searchParams.get('level') || '';
  const employmentType = searchParams.get('employmentType') || '';
  const q = searchParams.get('q') || '';

  /* Sync search input with URL */
  useEffect(() => {
    setInputValue(q);
    setSearchQuery(q);
  }, [q]);

  /* Build query string from params */
  const buildQueryString = useCallback(
    (overrides: Record<string, string> = {}) => {
      const params = new URLSearchParams();
      params.set('type', 'browse');
      params.set('limit', '20');
      if (overrides.page) {
        params.set('page', overrides.page);
      }
      const qVal = overrides.q ?? q;
      const wmVal = overrides.workMode ?? workMode;
      const lvlVal = overrides.level ?? level;
      const etVal = overrides.employmentType ?? employmentType;
      if (qVal) params.set('q', qVal);
      if (wmVal) params.set('workMode', wmVal);
      if (lvlVal) params.set('level', lvlVal);
      if (etVal) params.set('employmentType', etVal);
      return params.toString();
    },
    [q, workMode, level, employmentType]
  );

  /* Fetch jobs */
  const fetchJobs = useCallback(
    async (pageNum: number, append = false) => {
      const isLoadMore = append;
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      try {
        const qs = buildQueryString({ page: String(pageNum) });
        const res = await fetch(`/api/jobs?${qs}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        setJobs((prev) => (isLoadMore ? [...prev, ...(data.jobs || [])] : data.jobs || []));
        setTotal(data.total || 0);
        setHasMore(data.hasMore || false);
        setPage(pageNum);
      } catch (err) {
        console.error('[JobsPage] Fetch error:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildQueryString]
  );

  /* Initial fetch and refetch on filter change */
  useEffect(() => {
    fetchJobs(1);
  }, [q, workMode, level, employmentType, fetchJobs]);

  /* Filter toggle handler */
  const toggleFilter = (param: string, value: string) => {
    const current = searchParams.get(param);
    const params = new URLSearchParams(searchParams.toString());
    if (current === value) {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  };

  /* Search submit */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  };

  /* Clear search */
  const clearSearch = () => {
    setSearchQuery('');
    setInputValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  };

  /* Load more */
  const handleLoadMore = () => {
    fetchJobs(page + 1, true);
  };

  /* Active filter display label */
  const activeFilters = useMemo(() => {
    const result: { param: string; display: string }[] = [];
    FILTER_GROUPS.forEach((group) => {
      const val = searchParams.get(group.param);
      if (val) {
        const opt = group.options.find((o) => o.value === val);
        if (opt) result.push({ param: group.param, display: opt.display });
      }
    });
    return result;
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-divider">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
          <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Browse Jobs
          </h1>
          <p className="text-[13px] text-muted mb-6">
            {total > 0 ? `${total.toLocaleString()} active positions` : '12,400+ active positions'}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl mb-2">
            <div className="border border-divider rounded-xl p-1.5">
              <div className="flex">
                <div className="flex items-center pl-4 text-muted">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Job title, company, keyword..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-sm bg-transparent focus:outline-none placeholder-muted/60 pl-3 py-3"
                />
                {(inputValue || q) && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-muted hover:text-ink transition-colors pr-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="text-sm font-semibold text-ink hover:text-accent transition-colors shrink-0 pr-4"
                >
                  Search →
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-divider sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-3 -mx-1 px-1">
            {FILTER_GROUPS.map((group) => (
              <div key={group.key} className="shrink-0">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest mr-2">
                  {group.label}
                </span>
                <div className="inline-flex gap-1.5">
                  {group.options.map((opt) => {
                    const isActive = searchParams.get(group.param) === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleFilter(group.param, opt.value)}
                        className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-accent text-white border-accent'
                            : 'border-subtle text-muted hover:border-divider hover:text-ink'
                        }`}
                      >
                        {opt.display}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        {/* Active filter summary */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-muted">Filters:</span>
            {activeFilters.map((f) => (
              <span
                key={f.param}
                className="inline-flex items-center gap-1 text-[11px] bg-accent-bg text-accent-dark px-2.5 py-1 rounded-full font-medium"
              >
                {f.display}
                <button onClick={() => toggleFilter(f.param, searchParams.get(f.param) || '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Job list */}
        {loading ? (
          <div className="divide-y divide-subtle">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">No listings found</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              Try adjusting your search or filters. New jobs are posted daily, so check back soon.
            </p>
            {(activeFilters.length > 0 || q) && (
              <button
                onClick={() => router.push('/jobs')}
                className="mt-4 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-subtle">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => openJobById(job.id)} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 text-[13px] font-medium text-ink border border-divider rounded-xl px-6 py-3 hover:bg-surface active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Load More Jobs
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Bottom count */}
            <p className="text-center text-[11px] text-muted mt-6">
              Showing {jobs.length} of {total.toLocaleString()} results
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page export with Suspense ── */
export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
            <div className="h-10 bg-subtle rounded w-48 animate-pulse mb-3" />
            <div className="h-4 bg-subtle rounded w-36 animate-pulse mb-6" />
            <div className="h-12 bg-subtle rounded-xl max-w-xl animate-pulse" />
          </div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
