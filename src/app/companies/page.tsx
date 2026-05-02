'use client';

import { useState, useMemo } from 'react';
import { useJobModal } from '@/components/jobready/JobModalContext';
import { Building2, Search, X, MapPin, Briefcase, Hash, CheckCircle } from 'lucide-react';

/* ── Static company data ── */
const COMPANIES = [
  {
    initial: 'S',
    name: 'Safaricom',
    industry: 'Telecommunications',
    orgType: 'Private Sector',
    positions: 34,
    location: 'Nairobi',
    featuredJobId: 'safaricom-senior-pm',
    verified: true,
  },
  {
    initial: 'E',
    name: 'Equity Bank',
    industry: 'Banking & Finance',
    orgType: 'Private Sector',
    positions: 28,
    location: 'Nairobi',
    featuredJobId: 'equity-financial-analyst',
    verified: true,
  },
  {
    initial: 'K',
    name: 'KCB Bank',
    industry: 'Banking & Finance',
    orgType: 'Private Sector',
    positions: 22,
    location: 'Nairobi',
    featuredJobId: 'kcb-backend-developer',
    verified: true,
  },
  {
    initial: 'N',
    name: 'NCBA Group',
    industry: 'Banking & Finance',
    orgType: 'Private Sector',
    positions: 15,
    location: 'Nairobi',
    featuredJobId: 'ncba-graduate-trainee',
    verified: true,
  },
  {
    initial: 'E',
    name: 'EABL',
    industry: 'Food & Beverage',
    orgType: 'Private Sector',
    positions: 12,
    location: 'Nairobi',
    featuredJobId: 'eabl-marketing-assistant',
    verified: true,
  },
  {
    initial: 'K',
    name: 'KRA',
    industry: 'Government & Public Admin',
    orgType: 'National Government',
    positions: 8,
    location: 'Nairobi',
    featuredJobId: 'kra-graduate-trainee',
    verified: true,
  },
  {
    initial: 'K',
    name: 'KenGen',
    industry: 'Energy & Utilities',
    orgType: 'State Corporation',
    positions: 11,
    location: 'Nairobi',
    featuredJobId: 'kengen-engineer',
    verified: true,
  },
  {
    initial: 'T',
    name: 'Telkom Kenya',
    industry: 'Telecommunications',
    orgType: 'Private Sector',
    positions: 9,
    location: 'Nairobi',
    featuredJobId: 'telkom-network-engineer',
    verified: true,
  },
  {
    initial: 'I',
    name: 'I&M Bank',
    industry: 'Banking & Finance',
    orgType: 'Private Sector',
    positions: 14,
    location: 'Nairobi',
    featuredJobId: 'im-bank-analyst',
    verified: true,
  },
  {
    initial: 'H',
    name: 'Housing Finance',
    industry: 'Real Estate & Finance',
    orgType: 'Private Sector',
    positions: 7,
    location: 'Nairobi',
    featuredJobId: 'hf-property-manager',
    verified: true,
  },
  {
    initial: 'B',
    name: 'Britam',
    industry: 'Insurance',
    orgType: 'Private Sector',
    positions: 10,
    location: 'Nairobi',
    featuredJobId: 'britam-underwriter',
    verified: true,
  },
  {
    initial: 'C',
    name: 'Co-op Bank',
    industry: 'Banking & Finance',
    orgType: 'Co-operative',
    positions: 19,
    location: 'Nairobi',
    featuredJobId: 'co-op-junior-accountant',
    verified: true,
  },
];

/* ── Company card ── */
function CompanyCard({ company, onClick }: { company: typeof COMPANIES[number]; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group border border-divider rounded-xl p-5 hover:bg-surface transition-colors active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Company initial */}
        <div className="w-14 h-14 border border-divider rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-xl text-muted bg-surface group-hover:border-accent/30 transition-colors">
          {company.initial}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name & verified */}
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading text-[15px] font-bold truncate group-hover:text-accent transition-colors">
              {company.name}
            </h3>
            {company.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
            )}
          </div>

          {/* Industry */}
          <p className="text-[11px] text-muted mt-0.5 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {company.industry}
          </p>

          {/* Org type */}
          <p className="text-[11px] text-muted/60 mt-0.5">
            {company.orgType}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-subtle">
            <span className="flex items-center gap-1 text-[11px] text-muted">
              <Hash className="w-3 h-3" />
              <span className="font-medium text-ink">{company.positions}</span> open
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted">
              <MapPin className="w-3 h-3" />
              {company.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function CompaniesPage() {
  const { openJobById } = useJobModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return COMPANIES;
    const q = searchQuery.toLowerCase();
    return COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.orgType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-divider">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-bg rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight">
                Companies
              </h1>
            </div>
          </div>
          <p className="text-[13px] text-muted ml-[52px]">
            Explore verified employers hiring in Kenya
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-md mt-6 ml-0 sm:ml-[52px]">
            <div className="border border-divider rounded-lg px-3 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                placeholder="Search companies..."
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
        </div>
      </div>

      {/* Company grid */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">No companies found</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              No companies match your search. Try a different keyword.
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={company.name}
                  company={company}
                  onClick={() => openJobById(company.featuredJobId)}
                />
              ))}
            </div>
            <p className="text-center text-[11px] text-muted mt-8">
              {filteredCompanies.length} verified employer{filteredCompanies.length !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
