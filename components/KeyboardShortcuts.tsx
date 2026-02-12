"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface KeyboardShortcutsProps {
  blogSlugs?: string[];
}

export default function KeyboardShortcuts({ blogSlugs = [] }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentBlogIndex = useCallback(() => {
    if (!pathname.startsWith("/blog/")) return -1;
    const slug = pathname.replace("/blog/", "");
    return blogSlugs.indexOf(slug);
  }, [pathname, blogSlugs]);

  const goToNextPost = useCallback(() => {
    const currentIndex = getCurrentBlogIndex();
    if (currentIndex >= 0 && currentIndex < blogSlugs.length - 1) {
      router.push(`/blog/${blogSlugs[currentIndex + 1]}`);
    }
  }, [getCurrentBlogIndex, blogSlugs, router]);

  const goToPrevPost = useCallback(() => {
    const currentIndex = getCurrentBlogIndex();
    if (currentIndex > 0) {
      router.push(`/blog/${blogSlugs[currentIndex - 1]}`);
    }
  }, [getCurrentBlogIndex, blogSlugs, router]);

  const focusSearch = useCallback(() => {
    const searchInput = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="Search"]');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Only escape works in inputs
        if (e.key === "Escape") {
          target.blur();
          setShowHelp(false);
        }
        return;
      }

      // Show help modal
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Close help modal
      if (e.key === "Escape") {
        setShowHelp(false);
        // Also close any modals
        const closeButton = document.querySelector<HTMLButtonElement>('[aria-label="Close"]');
        closeButton?.click();
        return;
      }

      // Navigate to next/previous post (j/k like Vim)
      if (e.key === "j" && !e.metaKey && !e.ctrlKey) {
        goToNextPost();
        return;
      }
      if (e.key === "k" && !e.metaKey && !e.ctrlKey) {
        goToPrevPost();
        return;
      }

      // Focus search (/ or Cmd/Ctrl+K)
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) {
        e.preventDefault();
        focusSearch();
        return;
      }

      // Go home (g + h)
      if (e.key === "h" && !e.metaKey && !e.ctrlKey) {
        router.push("/");
        return;
      }

      // Go to journeys (g + j - but we use j for next, so use "g")
      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        router.push("/journeys");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPost, goToPrevPost, focusSearch, router]);

  return (
    <>
      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-[var(--background-card)] rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-lg hover:bg-[var(--background-alt)] transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-[var(--muted)] uppercase tracking-wider mb-2">
                Navigation
              </div>
              <ShortcutRow keys={["j"]} description="Next post" />
              <ShortcutRow keys={["k"]} description="Previous post" />
              <ShortcutRow keys={["h"]} description="Go home" />
              <ShortcutRow keys={["g"]} description="Go to journeys" />

              <div className="h-px bg-[var(--border)] my-4" />

              <div className="text-sm text-[var(--muted)] uppercase tracking-wider mb-2">
                Actions
              </div>
              <ShortcutRow keys={["/"]} description="Focus search" />
              <ShortcutRow keys={["⌘", "K"]} description="Focus search" />
              <ShortcutRow keys={["Esc"]} description="Close modal / blur input" />
              <ShortcutRow keys={["?"]} description="Show this help" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="px-2 py-1 text-xs font-mono bg-[var(--background-alt)] border border-[var(--border)] rounded">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="mx-1 text-[var(--muted)]">+</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
