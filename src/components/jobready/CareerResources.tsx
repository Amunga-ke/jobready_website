import Image from 'next/image';
import SectionNumber from './SectionNumber';

const articles = [
  { title: '5 Tips for Your First County Government Interview', time: '3 min read' },
  { title: 'Salary Negotiation in Kenya\'s Job Market', time: '5 min read' },
  { title: 'CV Mistakes That Get Your Application Rejected', time: '4 min read' },
  { title: 'Remote Work: Legitimate Opportunities vs. Scams', time: '6 min read' },
  { title: 'From Internship to Full-Time: A Transition Guide', time: '4 min read' },
];

export default function CareerResources() {
  return (
    <section className="py-14 relative overflow-hidden">
      <SectionNumber num="10" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Career Resources</h2>
          <a href="#" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            All articles →
          </a>
        </div>
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 group cursor-pointer">
            <div className="aspect-[16/9] bg-subtle rounded-xl overflow-hidden border border-divider">
              <Image
                src="https://picsum.photos/seed/kra-career-final/800/450.jpg"
                alt=""
                width={800}
                height={450}
                unoptimized
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="mt-4 border-t border-divider pt-4">
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest">Interview Tips</span>
              <h3 className="font-heading text-xl font-bold mt-1.5 group-hover:text-accent-dark transition-colors">
                How to Pass the KRA Graduate Trainee Assessment
              </h3>
              <p className="text-[13px] text-muted mt-2 leading-relaxed line-clamp-2">
                A complete guide to the KRA recruitment process, including sample questions, tips from successful candidates, and what evaluators look for.
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-0 divide-y divide-divider">
              {articles.map((article, i) => (
                <a
                  key={i}
                  href="#"
                  className={`block py-4 group ${i === 0 ? 'first:pt-0' : ''} ${i === articles.length - 1 ? 'last:pb-0' : ''}`}
                >
                  <h4 className="text-sm font-medium group-hover:text-accent transition-colors">{article.title}</h4>
                  <span className="font-mono text-[11px] text-muted mt-1 block">{article.time}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
