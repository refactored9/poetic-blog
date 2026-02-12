"use client";

import { useState, useCallback } from "react";
import { subscribeNewsletter } from "@/lib/api";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }, [status]);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!email.trim()) {
      setStatus("error");
      setMessage("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

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
    <section className="bg-[var(--background-section)] py-8 md:py-12">
      <div className="wide-width text-center">
        <h2 className="text-xl md:text-3xl font-serif mb-2 md:mb-4">
          Letters from the Road
        </h2>
        <p className="text-[var(--muted)] text-sm md:text-base max-w-md mx-auto mb-5 md:mb-8 px-4">
          Stories, photographs, and quiet reflections from the wandering path, delivered to your inbox.
        </p>

        {status === "success" ? (
          <div className="max-w-md mx-auto px-4">
            <div className="bg-[var(--background)] border border-[var(--success)] rounded-sm p-3 md:p-4">
              <p className="text-[var(--success)] text-xs md:text-sm">{message}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleBlur}
                  placeholder="your@email.com"
                  disabled={status === "loading"}
                  aria-invalid={!!validationError}
                  aria-describedby={validationError ? "email-error" : undefined}
                  className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-[var(--background)] border rounded-sm text-sm focus:outline-none transition-colors disabled:opacity-50 ${
                    validationError
                      ? "border-[var(--error)] focus:border-[var(--error)]"
                      : "border-[var(--border)] focus:border-[var(--accent)]"
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || !!validationError}
                className="btn btn-primary whitespace-nowrap disabled:opacity-50 text-sm"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            {validationError && (
              <p id="email-error" className="text-[var(--error)] text-xs mt-2 text-left" role="alert">
                {validationError}
              </p>
            )}
          </form>
        )}

        {status === "error" && (
          <p className="text-[var(--error)] text-xs md:text-sm mt-3 md:mt-4 px-4">{message}</p>
        )}

        <p className="text-[10px] md:text-xs text-[var(--muted-soft)] mt-3 md:mt-4">
          Sent rarely, read slowly. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
