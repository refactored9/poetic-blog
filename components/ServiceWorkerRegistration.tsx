"use client";

import { useEffect, useState } from "react";

interface ServiceWorkerRegistrationProps {
  onUpdateAvailable?: () => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

export default function ServiceWorkerRegistration({
  onUpdateAvailable,
  onOffline,
  onOnline,
}: ServiceWorkerRegistrationProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if service workers are supported
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("[App] Service worker registered");

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New version available
                setUpdateAvailable(true);
                onUpdateAvailable?.();
              }
            });
          }
        });

        // Check for updates periodically (every hour)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      } catch (error) {
        console.error("[App] Service worker registration failed:", error);
      }
    };

    registerSW();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      onOnline?.();
    };

    const handleOffline = () => {
      setIsOffline(true);
      onOffline?.();
    };

    // Set initial state
    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onUpdateAvailable, onOffline, onOnline]);

  // Function to cache reading list items for offline access
  const cacheReadingList = () => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
      return;
    }

    try {
      const bookmarks = localStorage.getItem("poetic-blog-bookmarks");
      if (bookmarks) {
        const items = JSON.parse(bookmarks);
        const urls = items.map((item: { slug: string }) => `/blog/${item.slug}`);

        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_PAGES",
          urls,
        });
      }
    } catch {
      // Ignore errors
    }
  };

  // Function to skip waiting and reload
  const updateServiceWorker = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  return (
    <>
      {/* Offline indicator */}
      {isOffline && (
        <div className="fixed top-14 md:top-20 left-0 right-0 z-40 bg-[var(--accent)] text-white text-center py-2 text-sm animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
            You&apos;re offline. Some features may be limited.
            <button
              onClick={cacheReadingList}
              className="underline hover:no-underline ml-2"
            >
              Save reading list
            </button>
          </div>
        </div>
      )}

      {/* Update available notification */}
      {updateAvailable && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 bg-[var(--foreground)] text-[var(--background)] rounded-lg shadow-lg p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium">Update available</p>
              <p className="text-sm opacity-80 mt-1">
                A new version is available. Refresh to get the latest features.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={updateServiceWorker}
                  className="px-3 py-1.5 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
                >
                  Refresh now
                </button>
                <button
                  onClick={() => setUpdateAvailable(false)}
                  className="px-3 py-1.5 text-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
