"use client";

export default function NewsletterForm() {
  function handleSubmit(e) {
    e.preventDefault();
    // Phase 6: wire to Resend / Mailchimp audience
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email address"
        required
        className="flex-1 px-5 py-3.5 font-body text-sm bg-transparent border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white/70"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="px-8 py-3.5 font-body text-sm font-medium tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
