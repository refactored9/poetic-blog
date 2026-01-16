"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
  isActive?: boolean;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/newsletter`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading subscribers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubscriber(id: string) {
    if (!confirm("Remove this subscriber?")) return;

    try {
      await fetch(`${API_URL}/newsletter/${id}`, { method: "DELETE" });
      setSubscribers(subscribers.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    }
  }

  function exportToCSV() {
    const headers = ["Email", "Subscribed Date"];
    const rows = subscribers.map((s) => [
      s.email,
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyAllEmails() {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    alert("All emails copied to clipboard!");
  }

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-20">
      <div className="wide-width">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <Link href="/studio" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif">Subscribers</h1>
          </div>
          <p className="text-[var(--muted)] text-sm md:text-base pl-8 md:pl-9">People who want to follow your journey</p>
        </header>

        {/* Stats & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl md:text-3xl font-serif text-[var(--accent)]">{subscribers.length}</p>
              <p className="text-xs md:text-sm text-[var(--muted)]">Total Subscribers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
            <button onClick={copyAllEmails} className="btn btn-secondary flex-1 sm:flex-initial text-sm" disabled={subscribers.length === 0}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Copy All</span>
              <span className="sm:hidden">Copy</span>
            </button>
            <button onClick={exportToCSV} className="btn btn-secondary flex-1 sm:flex-initial text-sm" disabled={subscribers.length === 0}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subscribers..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--background-card)] border border-[var(--border)] rounded-lg focus:border-[var(--accent)] outline-none text-sm"
            />
          </div>
        </div>

        {/* Subscribers List */}
        {subscribers.length === 0 ? (
          <div className="card p-8 md:p-12 text-center">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-[var(--muted)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-lg md:text-xl font-serif mb-2">No subscribers yet</h2>
            <p className="text-[var(--muted)] text-sm md:text-base">When people subscribe to your newsletter, they&apos;ll appear here</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="card p-6 md:p-8 text-center">
            <p className="text-[var(--muted)]">No subscribers match your search</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber._id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <a
                        href={`mailto:${subscriber.email}`}
                        className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors font-medium break-all text-sm"
                      >
                        {subscriber.email}
                      </a>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        Subscribed {new Date(subscriber.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(subscriber.email);
                          alert("Email copied!");
                        }}
                        className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)] rounded transition-colors"
                        title="Copy email"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteSubscriber(subscriber._id)}
                        className="p-2 text-[var(--muted)] hover:text-[var(--error)] hover:bg-red-50 rounded transition-colors"
                        title="Remove subscriber"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background-alt)]">
                    <th className="text-left px-6 py-4 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-[var(--background-alt)] transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${subscriber.email}`}
                          className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                        >
                          {subscriber.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--muted)]">
                        {new Date(subscriber.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(subscriber.email);
                              alert("Email copied!");
                            }}
                            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)] rounded transition-colors"
                            title="Copy email"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteSubscriber(subscriber._id)}
                            className="p-2 text-[var(--muted)] hover:text-[var(--error)] hover:bg-red-50 rounded transition-colors"
                            title="Remove subscriber"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
