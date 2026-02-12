"use client";

import { useState, useEffect } from "react";

interface Reaction {
  emoji: string;
  label: string;
  count: number;
}

interface ReactionButtonProps {
  blogId: string;
  initialReactions?: Record<string, number>;
}

const REACTIONS = [
  { emoji: "❤️", label: "love" },
  { emoji: "👏", label: "clap" },
  { emoji: "🔥", label: "fire" },
  { emoji: "💡", label: "insightful" },
  { emoji: "😢", label: "touching" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function getFingerprint(): string {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem("user-fingerprint");
  if (stored) return stored;

  const fingerprint = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem("user-fingerprint", fingerprint);
  return fingerprint;
}

function getUserReactions(blogId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(`reactions-${blogId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUserReaction(blogId: string, reactionType: string, add: boolean): void {
  const current = getUserReactions(blogId);
  if (add && !current.includes(reactionType)) {
    current.push(reactionType);
  } else if (!add) {
    const index = current.indexOf(reactionType);
    if (index > -1) current.splice(index, 1);
  }
  localStorage.setItem(`reactions-${blogId}`, JSON.stringify(current));
}

export default function ReactionButton({ blogId, initialReactions = {} }: ReactionButtonProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Fetch reactions from API
  useEffect(() => {
    setMounted(true);
    setUserReactions(getUserReactions(blogId));

    async function fetchReactions() {
      try {
        const res = await fetch(`${API_BASE_URL}/reactions/${blogId}`);
        if (res.ok) {
          const data = await res.json();
          setReactions(data.reactions || {});
        }
      } catch {
        // Use initial reactions if fetch fails
      }
    }

    fetchReactions();
  }, [blogId]);

  const handleReaction = async (reactionType: string) => {
    const hasReacted = userReactions.includes(reactionType);
    const fingerprint = getFingerprint();

    // Optimistic update
    setIsAnimating(reactionType);
    setReactions((prev) => ({
      ...prev,
      [reactionType]: Math.max(0, (prev[reactionType] || 0) + (hasReacted ? -1 : 1)),
    }));

    if (hasReacted) {
      setUserReactions((prev) => prev.filter((r) => r !== reactionType));
      saveUserReaction(blogId, reactionType, false);
    } else {
      setUserReactions((prev) => [...prev, reactionType]);
      saveUserReaction(blogId, reactionType, true);
    }

    setTimeout(() => setIsAnimating(null), 300);

    // Send to API
    try {
      await fetch(`${API_BASE_URL}/reactions`, {
        method: hasReacted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          reactionType,
          fingerprint,
        }),
      });
    } catch {
      // Revert on error
      setReactions((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, (prev[reactionType] || 0) + (hasReacted ? 1 : -1)),
      }));
      if (hasReacted) {
        setUserReactions((prev) => [...prev, reactionType]);
        saveUserReaction(blogId, reactionType, true);
      } else {
        setUserReactions((prev) => prev.filter((r) => r !== reactionType));
        saveUserReaction(blogId, reactionType, false);
      }
    }
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="skeleton h-10 w-24 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Collapsed view - just show total */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-alt)] hover:bg-[var(--border)] transition-colors"
        >
          <span className="text-lg">❤️</span>
          <span className="text-sm font-medium">{totalReactions || "React"}</span>
        </button>
      ) : (
        /* Expanded view - show all reactions */
        <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--background-card)] border border-[var(--border)] shadow-lg animate-scale-in">
          {REACTIONS.map(({ emoji, label }) => {
            const count = reactions[label] || 0;
            const hasReacted = userReactions.includes(label);

            return (
              <button
                key={label}
                onClick={() => handleReaction(label)}
                className={`
                  relative flex items-center gap-1 px-3 py-1.5 rounded-full transition-all
                  ${hasReacted
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "hover:bg-[var(--background-alt)]"
                  }
                  ${isAnimating === label ? "scale-125" : ""}
                `}
                title={label}
              >
                <span className={`text-lg transition-transform ${isAnimating === label ? "animate-bounce" : ""}`}>
                  {emoji}
                </span>
                {count > 0 && (
                  <span className="text-xs font-medium">{count}</span>
                )}
              </button>
            );
          })}

          {/* Close button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 rounded-full hover:bg-[var(--background-alt)] text-[var(--muted)]"
            aria-label="Close reactions"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
