"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (status === "sent") {
    return (
      <div className="text-center py-8 md:py-12 px-4 md:px-6 bg-[var(--background-alt)] rounded-lg md:rounded-xl">
        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
          <svg className="w-6 h-6 md:w-8 md:h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-3">Message Sent</h3>
        <p className="text-[var(--muted)] text-sm md:text-base mb-4 md:mb-6">
          Thank you for reaching out. Your words have found their way to me,
          and I shall respond as soon as time permits.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs md:text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs md:text-sm text-[var(--foreground)] mb-1.5 md:mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="How may I address you?"
          className="input-field text-sm md:text-base"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs md:text-sm text-[var(--foreground)] mb-1.5 md:mb-2">
          Your Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Where shall I send my reply?"
          className="input-field text-sm md:text-base"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-xs md:text-sm text-[var(--foreground)] mb-1.5 md:mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="input-field text-sm md:text-base"
        >
          <option value="">What brings you here?</option>
          <option value="general">Just saying hello</option>
          <option value="collaboration">Collaboration inquiry</option>
          <option value="feedback">Sharing feedback</option>
          <option value="photography">Photography inquiry</option>
          <option value="other">Something else</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs md:text-sm text-[var(--foreground)] mb-1.5 md:mb-2">
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Share your thoughts, questions, or simply a kind word..."
          className="textarea-field text-sm md:text-base"
        />
      </div>

      {/* Error message */}
      {status === "error" && (
        <div className="p-3 md:p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-xs md:text-sm text-red-600">
            Something went wrong. Please try again, or reach out through another channel.
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="pt-1 md:pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          {status === "sending" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Message
            </>
          )}
        </button>
      </div>

      {/* Privacy note */}
      <p className="text-[10px] md:text-xs text-[var(--muted-soft)] pt-1 md:pt-2">
        Your information is kept private and will only be used to respond to your message.
        See our <a href="/privacy" className="underline hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>.
      </p>
    </form>
  );
}
