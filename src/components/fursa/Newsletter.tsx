export default function Newsletter() {
  return (
    <section className="py-20 border-t border-divider" id="newsletter-section">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight mb-3">Get jobs in your inbox every morning</h2>
        <p className="text-muted text-sm mb-8 max-w-md mx-auto">
          Join 45,000 jobseekers who get matched jobs every morning. No spam, unsubscribe anytime.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3.5 bg-white border border-divider rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
          />
          <button className="bg-ink text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-ink/90 transition-colors">
            Join
          </button>
        </div>
      </div>
    </section>
  );
}
