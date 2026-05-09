"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ slug, title }: { slug: string; title: string }) {
  const handleShare = async () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/jobs/${slug}`
      : `/jobs/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch {
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        alert("Link copied to clipboard!");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-muted hover:text-ink hover:bg-ink/[0.04] transition-colors"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
