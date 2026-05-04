"use client";

import { Share2 } from "lucide-react";

export default function ArticleShareButton({ url }: { url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch {
        // Fallback
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-[12px] font-medium text-muted hover:text-accent transition-colors shrink-0"
    >
      <Share2 className="w-3.5 h-3.5" />
      Share Article
    </button>
  );
}
