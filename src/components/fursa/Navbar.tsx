export default function Navbar() {
  return (
    <nav className="pt-5 pb-5">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        <a href="#" className="font-heading font-bold text-lg tracking-tight">
          JOB<span className="text-accent">NET</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          <a href="#" className="text-[13px] font-medium text-muted hover:text-ink transition-colors">Jobs</a>
          <a href="#" className="text-[13px] font-medium text-muted hover:text-ink transition-colors">Companies</a>
          <a href="#" className="text-[13px] font-medium text-muted hover:text-ink transition-colors">Resources</a>
          <a href="#" className="text-[13px] font-medium text-muted hover:text-ink transition-colors">Salary Guide</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-[13px] font-medium text-muted hover:text-ink transition-colors hidden sm:block">Sign In</a>
          <a href="#" className="bg-ink text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors">Post Job</a>
        </div>
      </div>
    </nav>
  );
}
