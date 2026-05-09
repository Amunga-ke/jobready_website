/**
 * Google AdSense Script Loader
 * Loads once, globally, in the root layout.
 */
"use client";

import { useEffect } from "react";

export default function AdSenseScript() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as Record<string, boolean>).__adsense_loaded) return;
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      (window as unknown as Record<string, boolean>).__adsense_loaded = true;
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8031704055036556";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    (window as unknown as Record<string, boolean>).__adsense_loaded = true;
  }, []);

  return null;
}
