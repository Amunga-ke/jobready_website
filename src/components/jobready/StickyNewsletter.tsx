'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function StickyNewsletter() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const newsletterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const newsletter = document.getElementById('newsletter-section');
      if (newsletter) {
        const bottom = newsletter.offsetTop + newsletter.offsetHeight;
        if (window.scrollY > bottom) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-sm border-t border-divider py-3 px-5">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <p className="text-[13px] text-muted hidden sm:block shrink-0">Get jobs in your inbox every morning.</p>
        <div className="flex gap-2 flex-1 sm:flex-none max-w-sm ml-auto">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 sm:w-56 px-3 py-2 bg-white border border-divider rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button className="bg-ink text-white px-4 py-2 text-sm font-medium hover:bg-ink/90 transition-colors rounded-lg">
            Join
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted hover:text-ink transition-colors shrink-0 ml-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
