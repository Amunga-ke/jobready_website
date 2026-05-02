'use client';

import { useState, useMemo } from 'react';
import { BookOpen, FileText, MessageSquare, TrendingUp, Award, Clock, Pen, DollarSign, GraduationCap, Users } from 'lucide-react';

/* ── Static article data ── */
const ARTICLES = [
  {
    title: '5 Tips for Your First County Government Interview',
    excerpt: 'Navigate Kenya\'s county government interview process with confidence. Learn what panelists look for in candidates and how to stand out.',
    category: 'Interview Tips',
    time: '3 min read',
    icon: 'award' as const,
    color: 'bg-teal-50 text-teal-600',
  },
  {
    title: 'Salary Negotiation in Kenya\'s Job Market',
    excerpt: 'Understand market rates, negotiate with confidence, and avoid common pitfalls when discussing compensation with Kenyan employers.',
    category: 'Salary Guide',
    time: '5 min read',
    icon: 'dollar' as const,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'CV Mistakes That Get Your Application Rejected',
    excerpt: 'Recruiters spend 6 seconds on your CV. Avoid these 10 critical mistakes that land your application in the rejection pile.',
    category: 'CV Writing',
    time: '4 min read',
    icon: 'file' as const,
    color: 'bg-red-50 text-red-600',
  },
  {
    title: 'Remote Work: Legitimate Opportunities vs. Scams',
    excerpt: 'With the rise of remote job listings in Kenya, learn how to spot fake job postings and find genuine work-from-home opportunities.',
    category: 'Interview Tips',
    time: '6 min read',
    icon: 'users' as const,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'From Internship to Full-Time: A Transition Guide',
    excerpt: 'Turn your Kenyan internship into a permanent position. Strategies to impress your supervisors and secure a full-time offer.',
    category: 'Career Growth',
    time: '4 min read',
    icon: 'trending' as const,
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'How to Write a Cover Letter That Gets Noticed',
    excerpt: 'A step-by-step guide to crafting a compelling cover letter tailored for Kenyan employers across different industries.',
    category: 'CV Writing',
    time: '5 min read',
    icon: 'pen' as const,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Understanding KRA Tax Deductions on Your Payslip',
    excerpt: 'Decode your Kenyan payslip. Learn about PAYE, NSSF, NHIF deductions and what they mean for your take-home pay.',
    category: 'Salary Guide',
    time: '7 min read',
    icon: 'dollar' as const,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Common Interview Questions for Banking Jobs in Kenya',
    excerpt: 'Prepare for interviews at Equity, KCB, Co-op Bank and more. Sample questions and model answers from industry professionals.',
    category: 'Interview Tips',
    time: '5 min read',
    icon: 'message' as const,
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Career Growth Paths in Kenya\'s Tech Sector',
    excerpt: 'From junior developer to CTO — map out your career trajectory in Kenya\'s booming technology ecosystem.',
    category: 'Career Growth',
    time: '6 min read',
    icon: 'graduation' as const,
    color: 'bg-cyan-50 text-cyan-600',
  },
];

/* ── Category filter config ── */
const CATEGORIES = ['All', 'CV Writing', 'Interview Tips', 'Salary Guide', 'Career Growth'];

/* ── Icon resolver ── */
function ArticleIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'award':
      return <Award className={className} />;
    case 'dollar':
      return <DollarSign className={className} />;
    case 'file':
      return <FileText className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'trending':
      return <TrendingUp className={className} />;
    case 'pen':
      return <Pen className={className} />;
    case 'message':
      return <MessageSquare className={className} />;
    case 'graduation':
      return <GraduationCap className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

/* ── Main component ── */
export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') return ARTICLES;
    return ARTICLES.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-divider">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-bg rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight">
                Career Resources
              </h1>
            </div>
          </div>
          <p className="text-[13px] text-muted ml-[52px]">
            Expert advice for your job search
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="border-b border-divider sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3 -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[12px] font-medium px-4 py-2 rounded-full border transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-accent text-white border-accent'
                    : 'border-subtle text-muted hover:border-divider hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article grid */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">No articles in this category</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              We&apos;re working on adding more content. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article, i) => (
              <a
                key={`${activeCategory}-${i}`}
                href="#"
                className="group border border-divider rounded-xl p-5 hover:bg-surface transition-colors active:scale-[0.98] transition-transform flex flex-col"
              >
                {/* Thumbnail */}
                <div className={`w-full aspect-[16/9] rounded-lg flex items-center justify-center mb-4 ${article.color}`}>
                  <ArticleIcon type={article.icon} className="w-8 h-8" />
                </div>

                {/* Category tag */}
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2">
                  {article.category}
                </span>

                {/* Title */}
                <h3 className="font-heading text-[15px] font-bold leading-snug group-hover:text-accent-dark transition-colors mb-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[12px] text-muted leading-relaxed line-clamp-3 flex-1">
                  {article.excerpt}
                </p>

                {/* Read time */}
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-subtle">
                  <Clock className="w-3 h-3 text-muted/60" />
                  <span className="font-mono text-[11px] text-muted">{article.time}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Bottom count */}
        <p className="text-center text-[11px] text-muted mt-8">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        </p>
      </div>
    </div>
  );
}
