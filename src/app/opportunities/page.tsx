'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useJobModal } from '@/components/jobready/JobModalContext';
import { GraduationCap, Briefcase, Award, DollarSign, Clock, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';

/* ── Tab config ── */
type TabKey = 'scholarships' | 'internships' | 'fellowships' | 'grants';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: typeof GraduationCap;
  apiType: string;
  listingTypeCode?: string;
}

const TABS: TabConfig[] = [
  { key: 'scholarships', label: 'Scholarships', icon: GraduationCap, apiType: 'scholarship' },
  { key: 'internships', label: 'Internships', icon: Briefcase, apiType: 'internship' },
  { key: 'fellowships', label: 'Fellowships', icon: Award, apiType: 'browse', listingTypeCode: 'FELLOWSHIP' },
  { key: 'grants', label: 'Grants', icon: DollarSign, apiType: 'browse', listingTypeCode: 'GRANT' },
];

/* ── Opportunity item from API ── */
interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  type: string;
  accent?: boolean;
  deadline?: string;
  urgent?: boolean;
}

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <div className="py-3.5 animate-pulse flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-subtle rounded w-3/4 mb-2" />
        <div className="h-3 bg-subtle rounded w-1/2" />
      </div>
      <div className="h-3 bg-subtle rounded w-16 ml-3" />
    </div>
  );
}

/* ── Main content ── */
function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openJobById } = useJobModal();

  const tabParam = searchParams.get('tab') as TabKey | null;
  const activeTab: TabKey = tabParam && TABS.some((t) => t.key === tabParam) ? tabParam : 'scholarships';

  const [items, setItems] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasDeadline] = useState(true);

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      params.set('type', currentTab.apiType);
      params.set('limit', '50');
      if (currentTab.listingTypeCode) {
        params.set('listingType', currentTab.listingTypeCode);
      }

      const res = await fetch(`/api/jobs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      // Map API response to our opportunity items
      const jobs = data.jobs || [];
      const mapped: OpportunityItem[] = jobs.map((job: Record<string, unknown>) => ({
        id: job.id as string || '',
        title: job.title as string || '',
        company: [job.company, job.location].filter(Boolean).join(' · ') as string,
        type: (job.type || job.deadline || '') as string,
        accent: activeTab === 'scholarships' ? !!(job.deadline) : false,
        deadline: job.deadline as string | undefined,
        urgent: job.urgent as boolean | undefined,
      }));

      setItems(mapped);
    } catch (err) {
      console.error('[OpportunitiesPage] Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const switchTab = (key: TabKey) => {
    router.push(`/opportunities?tab=${key}`, { scroll: false });
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-divider">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
          <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Opportunities
          </h1>
          <p className="text-[13px] text-muted">
            Scholarships, internships, fellowships and more
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-divider sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => switchTab(tab.key)}
                  className={`py-3 px-1 text-sm font-medium border-b-2 mr-6 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-ink border-accent'
                      : 'text-muted border-transparent hover:text-ink'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {loading ? (
          <div className="divide-y divide-subtle">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">Failed to load opportunities</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              Something went wrong. Please try refreshing the page.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              {(() => { const Icon = currentTab.icon; return <Icon className="w-7 h-7 text-muted/40" />; })()}
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">
              No {currentTab.label.toLowerCase()} found
            </h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              There are no {currentTab.label.toLowerCase()} listed at the moment. Check back soon — new opportunities are posted regularly.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-subtle">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openJobById(item.id)}
                  className="flex items-center justify-between py-3.5 group cursor-pointer hover:bg-surface rounded-lg -mx-2 px-2 transition-colors active:scale-[0.98] transition-transform"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                        {item.title}
                      </p>
                      {item.urgent && (
                        <span className="flex items-center gap-0.5 text-[9px] font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md shrink-0 border border-red-100">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted mt-0.5 truncate">{item.company}</p>
                  </div>
                  <span
                    className={`font-mono text-[11px] shrink-0 ml-3 flex items-center gap-1 ${
                      item.accent || item.urgent
                        ? 'text-accent font-medium'
                        : 'text-muted'
                    }`}
                  >
                    {hasDeadline && item.deadline ? (
                      <Clock className="w-3 h-3" />
                    ) : null}
                    {item.type || item.deadline || '—'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <span className="font-mono text-[10px] text-muted/50">
                {items.length} {currentTab.label.toLowerCase()} shown
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page with Suspense ── */
export default function OpportunitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
            <div className="h-10 bg-subtle rounded w-48 animate-pulse mb-3" />
            <div className="h-4 bg-subtle rounded w-72 animate-pulse" />
          </div>
          <div className="border-b border-divider">
            <div className="max-w-6xl mx-auto px-5 flex gap-8 py-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 bg-subtle rounded w-24 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <OpportunitiesContent />
    </Suspense>
  );
}
