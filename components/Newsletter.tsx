"use client";

import { useState, useCallback } from "react";
import { subscribeNewsletter } from "@/lib/api";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const validationError = touched && email && !isValidEmail(email)
    ? "Please enter a valid email address"
    : null;

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "error") { setStatus("idle"); setMessage(""); }
  }, [status]);

  const handleBlur = useCallback(() => { setTouched(true); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!email.trim()) { setStatus("error"); setMessage("Email is required"); return; }
    if (!isValidEmail(email)) { setStatus("error"); setMessage("Please enter a valid email address"); return; }
    setStatus("loading");
    setMessage("");
    try {
      const result = await subscribeNewsletter(email);
      setStatus("success");
      setMessage(result.message);
      setEmail("");
      setTouched(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="py-20 md:py-28 bg-[var(--background-section)] border-t border-[var(--border)]">
      <div className="wide-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div>
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[var(--muted)] mb-5">
              Stay in touch
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide leading-tight mb-5">
              Letters from<br />the Road
            </h2>
            <p className="text-[var(--muted)] text-base leading-relaxed max-w-sm">
              Stories, photographs, and quiet reflections delivered to your inbox. Sent rarely, read slowly.
            </p>
          </div>

          {/* Right — form */}
          <div>
            {status === "success" ? (
              <div className="border border-[var(--border)] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-[var(--success)]">
                    <svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium tracking-wide text-[var(--foreground)] mb-1">You&apos;re on the list.</p>
                    <p className="text-sm text-[var(--muted)]">{message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                    disabled={status === "loading"}
                    aria-invalid={!!validationError}
                    aria-describedby={validationError ? "email-error" : undefined}
                    className={`flex-1 px-5 py-4 bg-[var(--background-card)] border text-sm text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:outline-none transition-all duration-200 disabled:opacity-50 ${
                      validationError
                        ? "border-[var(--error)]"
                        : "border-[var(--border)] focus:border-[var(--foreground)]"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || !!validationError}
                    className="px-7 py-4 bg-[var(--foreground)] text-[var(--background)] text-[0.65rem] font-medium tracking-[0.15em] uppercase hover:opacity-80 disabled:opacity-40 transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Subscribing</span>
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>

                {validationError && (
                  <p id="email-error" className="text-[var(--error)] text-xs tracking-wide mt-3" role="alert">
                    {validationError}
                  </p>
                )}
                {status === "error" && message && (
                  <p className="text-[var(--error)] text-xs tracking-wide mt-3">{message}</p>
                )}

                <p className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--muted-soft)] mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
