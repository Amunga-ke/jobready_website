"use client";

import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";

export interface UpdateData {
  id: string;
  slug: string;
  title: string;
  body?: string | null;
  source: string;
  updateType: string;
  pdfUrl?: string | null;
  imageUrl?: string | null;
  listingSlug?: string | null;
  postedBy: string;
  createdAt: string;
}

interface UpdateModalContextType {
  /** Open the sidesheet for a specific update (by full data object) */
  openUpdate: (update: UpdateData) => void;
  /** Open the sidesheet by fetching the update by slug from the API */
  openUpdateBySlug: (slug: string) => void;
  /** Close the sidesheet */
  closeUpdate: () => void;
  /** Currently open update (null if closed) */
  currentUpdate: UpdateData | null;
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Whether a fetch is in progress */
  isLoading: boolean;
}

const UpdateModalContext = createContext<UpdateModalContextType>({
  openUpdate: () => {},
  openUpdateBySlug: () => {},
  closeUpdate: () => {},
  currentUpdate: null,
  isOpen: false,
  isLoading: false,
});

/**
 * Bypass Next.js App Router soft navigation by calling native History.
 */
function nativePushState(state: any, title: string, url: string | URL | null) {
  History.prototype.pushState.call(window.history, state, title, url);
}

export function UpdateModalProvider({ children }: { children: React.ReactNode }) {
  const [currentUpdate, setCurrentUpdate] = useState<UpdateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const popstateRef = useRef<string | null>(null);

  const pushUrlForUpdate = useCallback((slug: string) => {
    if (typeof window !== "undefined") {
      const url = `/updates/${slug}`;
      popstateRef.current = slug;
      nativePushState({ updateSlug: slug }, "", url);
    }
  }, []);

  const openUpdate = useCallback((update: UpdateData) => {
    setCurrentUpdate(update);
    pushUrlForUpdate(update.slug);
  }, [pushUrlForUpdate]);

  const openUpdateBySlug = useCallback(async (slug: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/updates/${slug}`);
      if (!res.ok) throw new Error("Update not found");
      const data = await res.json();
      if (data.update) {
        setCurrentUpdate(data.update);
        pushUrlForUpdate(data.update.slug);
      }
    } catch (error) {
      console.error("[openUpdateBySlug] Failed to fetch update:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pushUrlForUpdate]);

  const closeUpdate = useCallback(() => {
    if (typeof window !== "undefined" && popstateRef.current) {
      window.history.back();
      popstateRef.current = null;
    } else {
      setCurrentUpdate(null);
    }
  }, []);

  // Close on browser back
  useEffect(() => {
    const onPopState = () => {
      setCurrentUpdate(null);
      popstateRef.current = null;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <UpdateModalContext.Provider
      value={{
        openUpdate,
        openUpdateBySlug,
        closeUpdate,
        currentUpdate,
        isOpen: currentUpdate !== null,
        isLoading,
      }}
    >
      {children}
    </UpdateModalContext.Provider>
  );
}

export function useUpdateModal() {
  return useContext(UpdateModalContext);
}
