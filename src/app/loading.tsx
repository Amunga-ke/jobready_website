export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md px-5">
        <div className="h-6 bg-subtle rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-subtle rounded w-full animate-pulse" />
        <div className="h-4 bg-subtle rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-subtle rounded w-2/3 animate-pulse" />
        <div className="mt-6 space-y-3">
          <div className="h-24 bg-subtle rounded-xl animate-pulse" />
          <div className="h-24 bg-subtle rounded-xl animate-pulse" />
          <div className="h-24 bg-subtle rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
