"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
  repliedAt?: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">("all");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/contact`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`${API_URL}/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      setMessages(messages.map((m) => (m._id === id ? { ...m, status: "read" } : m)));
    } catch (error) {
      console.error("Error updating message:", error);
    }
  }

  async function sendReply() {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      setSending(true);

      // Send reply email via API
      const res = await fetch(`${API_URL}/contact/${selectedMessage._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });

      if (res.ok) {
        setMessages(messages.map((m) =>
          m._id === selectedMessage._id ? { ...m, status: "replied", repliedAt: new Date().toISOString() } : m
        ));
        setReplyText("");
        alert("Reply sent successfully!");
      } else {
        // If API doesn't support reply, just mark as replied
        await fetch(`${API_URL}/contact/${selectedMessage._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "replied" }),
        });
        setMessages(messages.map((m) =>
          m._id === selectedMessage._id ? { ...m, status: "replied", repliedAt: new Date().toISOString() } : m
        ));
        // Open email client as fallback
        window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=${encodeURIComponent(replyText)}`;
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      // Fallback to mailto
      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=${encodeURIComponent(replyText)}`;
    } finally {
      setSending(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;

    try {
      await fetch(`${API_URL}/contact/${id}`, { method: "DELETE" });
      setMessages(messages.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  const filteredMessages = messages.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-20">
      <div className="wide-width">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <Link href="/studio" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif">Messages</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs bg-[var(--error)] text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm md:text-base text-[var(--muted)]">Contact form submissions</p>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1.5 px-1.5">
          {(["all", "unread", "read", "replied"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                filter === f
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--background-alt)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-[var(--error)] text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Messages List */}
          <div className="space-y-3 md:space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="card p-8 md:p-12 text-center">
                <svg className="w-12 md:w-16 h-12 md:h-16 text-[var(--muted)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-[var(--muted)]">No messages yet</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === "unread") {
                      markAsRead(message._id);
                    }
                  }}
                  className={`card p-3 md:p-4 cursor-pointer transition-all ${
                    selectedMessage?._id === message._id
                      ? "border-[var(--accent)] shadow-md"
                      : "hover:border-[var(--border)]"
                  } ${message.status === "unread" ? "border-l-4 border-l-[var(--accent)]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate text-sm md:text-base">{message.name}</p>
                        <span
                          className={`px-1.5 md:px-2 py-0.5 text-xs rounded flex-shrink-0 ${
                            message.status === "unread"
                              ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                              : message.status === "replied"
                              ? "bg-[var(--success)]/10 text-[var(--success)]"
                              : "bg-[var(--background-alt)] text-[var(--muted)]"
                          }`}
                        >
                          {message.status}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-[var(--foreground)] truncate">{message.subject}</p>
                      <p className="text-xs text-[var(--muted)] mt-1 truncate">{message.email}</p>
                      <p className="text-xs text-[var(--muted-soft)] mt-2">
                        {new Date(message.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message._id);
                      }}
                      className="p-2 text-[var(--muted)] hover:text-[var(--error)] hover:bg-red-50 rounded transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail & Reply - Mobile Modal */}
          {selectedMessage && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setSelectedMessage(null)}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-[var(--background)] rounded-t-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-[var(--background)] p-4 border-b border-[var(--border)] flex items-center justify-between">
                  <h2 className="text-lg font-serif">{selectedMessage.name}</h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-[var(--background-alt)] rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                  <p className="text-sm text-[var(--muted)] mt-2">
                    Subject: <span className="text-[var(--foreground)]">{selectedMessage.subject}</span>
                  </p>
                  <p className="text-xs text-[var(--muted-soft)] mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="border-t border-[var(--border)] mt-4 pt-4">
                    <p className="text-[var(--foreground-soft)] whitespace-pre-wrap leading-relaxed text-sm">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="border-t border-[var(--border)] mt-4 pt-4">
                    <h3 className="text-sm font-medium mb-3">Reply</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      rows={4}
                      className="w-full px-3 py-2 bg-[var(--background-card)] border border-[var(--border)] rounded-lg focus:border-[var(--accent)] outline-none resize-none text-sm mb-3"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={sendReply}
                        disabled={sending || !replyText.trim()}
                        className="btn btn-accent disabled:opacity-50 flex-1 sm:flex-none"
                      >
                        {sending ? "Sending..." : "Send Reply"}
                      </button>
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                        className="btn btn-secondary text-center flex-1 sm:flex-none"
                      >
                        Open in Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message Detail & Reply - Desktop */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            {selectedMessage ? (
              <div className="card p-6">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-serif mb-1">{selectedMessage.name}</h2>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-sm text-[var(--accent)] hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        selectedMessage.status === "unread"
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : selectedMessage.status === "replied"
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : "bg-[var(--background-alt)] text-[var(--muted)]"
                      }`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--muted)] mb-2">
                    Subject: <span className="text-[var(--foreground)]">{selectedMessage.subject}</span>
                  </p>
                  <p className="text-xs text-[var(--muted-soft)]">
                    Received:{" "}
                    {new Date(selectedMessage.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-6 mb-6">
                  <p className="text-[var(--foreground-soft)] whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-medium mb-3">Reply</h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={5}
                    className="w-full px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-lg focus:border-[var(--accent)] outline-none resize-none text-sm mb-4"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={sendReply}
                      disabled={sending || !replyText.trim()}
                      className="btn btn-accent disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send Reply"}
                    </button>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="btn btn-secondary"
                    >
                      Open in Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <svg className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-[var(--muted)]">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
