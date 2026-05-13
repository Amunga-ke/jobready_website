"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-KE">
      <body className="bg-surface text-ink font-sans antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
          <h1 className="font-heading text-4xl font-bold text-ink mb-4">Oops!</h1>
          <p className="text-[15px] text-muted mb-6 max-w-md">
            A critical error occurred. Our team has been notified. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 bg-ink text-white text-[14px] font-medium px-5 py-2.5 rounded-lg hover:bg-ink/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}
