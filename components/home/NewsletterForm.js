"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed. Please try again.");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-body text-sm text-white/90 py-3.5">
        You&apos;re on the list! Check your inbox for 10% off.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 px-5 py-3.5 font-body text-sm bg-transparent border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white/70 disabled:opacity-60"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-8 py-3.5 font-body text-sm font-medium tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {status === "error" && errorMsg && (
        <p className="font-body text-sm text-error">{errorMsg}</p>
      )}
    </div>
  );
}
