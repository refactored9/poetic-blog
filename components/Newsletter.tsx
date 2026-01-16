"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const result = await subscribeNewsletter(email);
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <section className="bg-[#f5f3f0] py-8 md:py-12">
      <div className="wide-width text-center">
        <h2 className="text-xl md:text-3xl font-serif mb-2 md:mb-4">
          Follow the Journey
        </h2>
        <p className="text-[var(--muted)] text-sm md:text-base max-w-md mx-auto mb-5 md:mb-8 px-4">
          New stories and photographs from my wanderings, delivered quietly to your inbox.
        </p>

        {status === "success" ? (
          <div className="max-w-md mx-auto px-4">
            <div className="bg-[var(--background)] border border-[var(--success)] rounded-sm p-3 md:p-4">
              <p className="text-[var(--success)] text-xs md:text-sm">{message}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center max-w-md mx-auto px-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === "loading"}
              className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-sm focus:border-[var(--accent)] outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn btn-primary whitespace-nowrap disabled:opacity-50 text-sm"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-[var(--error)] text-xs md:text-sm mt-3 md:mt-4 px-4">{message}</p>
        )}

        <p className="text-[10px] md:text-xs text-[var(--muted-soft)] mt-3 md:mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
