"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="font-heading text-2xl font-bold text-ink mb-2">Something went wrong</h2>
      <p className="text-[14px] text-muted mb-6 max-w-md">
        An unexpected error occurred. Please try again or browse our latest job listings.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 bg-ink text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-ink/90 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
        >
          Browse Jobs
        </a>
      </div>
    </div>
  );
}
