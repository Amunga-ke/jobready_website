'use client';

import { useState } from 'react';
import SectionNumber from './SectionNumber';

type TabKey = 'e' | 'i' | 's';

const entryLevelJobs = [
  { title: 'Junior Accountant', company: 'Co-operative Bank · Nairobi', type: 'Full-time' },
  { title: 'Customer Service Representative', company: 'Safaricom · Nairobi', type: 'Full-time' },
  { title: 'Data Entry Clerk', company: 'KRA · Nairobi', type: 'Contract' },
  { title: 'Marketing Assistant', company: 'EABL · Nairobi', type: 'Full-time' },
];

const internshipJobs = [
  { title: 'Finance Intern', company: 'Equity Bank · Nairobi', type: '3 months' },
  { title: 'Software Engineering Intern', company: 'Safaricom · Nairobi', type: '6 months' },
];

const scholarshipJobs = [
  { title: 'Mastercard Foundation Scholars', company: 'Univ. of Nairobi · Full Scholarship', type: '28 Feb', accent: true },
  { title: 'KCB Foundation Scholarship', company: 'KCB Group · Tuition + Stipend', type: '15 Mar' },
];

const tabs: { key: TabKey; label: string; count: string }[] = [
  { key: 'e', label: 'Entry Level', count: '340' },
  { key: 'i', label: 'Internships', count: '156' },
  { key: 's', label: 'Scholarships', count: '23' },
];

const tabContent: Record<TabKey, { jobs: typeof entryLevelJobs; total: number }> = {
  e: { jobs: entryLevelJobs, total: 340 },
  i: { jobs: internshipJobs, total: 156 },
  s: { jobs: scholarshipJobs, total: 23 },
};

export default function OpportunitiesTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('e');

  const current = tabContent[activeTab];

  return (
    <section className="py-14 bg-white border-t border-b border-divider relative overflow-hidden">
      <SectionNumber num="06" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex border-b border-divider">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-1 text-sm font-medium border-b-2 mr-6 transition-colors ${
                activeTab === tab.key
                  ? 'text-ink border-accent'
                  : 'text-muted border-transparent hover:text-ink'
              }`}
            >
              {tab.label}{' '}
              <span
                className={`font-mono text-[11px] ml-1 ${
                  activeTab === tab.key ? 'text-muted' : 'text-muted/40'
                }`}
              >
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
        <div className="py-5">
          <div className="divide-y divide-subtle">
            {current.jobs.map((job, i) => (
              <div
                key={`${activeTab}-${i}`}
                className="flex items-center justify-between py-3 group cursor-pointer hover:bg-surface rounded-lg -mx-2 px-2 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors">{job.title}</p>
                  <p className="text-[11px] text-muted mt-0.5">{job.company}</p>
                </div>
                <span
                  className={`font-mono text-[11px] shrink-0 ml-3 ${
                    'accent' in job && job.accent ? 'text-accent font-medium' : 'text-muted'
                  }`}
                >
                  {job.type}
                </span>
              </div>
            ))}
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-accent mt-4 transition-colors"
          >
            View all {current.total} →
          </a>
        </div>
      </div>
    </section>
  );
}
