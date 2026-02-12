"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { recordVisit } from "@/lib/api";

function getSource(): string {
  // Check UTM parameters first
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  if (utmSource) return utmSource;

  // Check referrer
  const referrer = document.referrer;
  if (!referrer) return "direct";

  try {
    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname;

    // Categorize known sources
    if (hostname.includes("google")) return "google";
    if (hostname.includes("facebook") || hostname.includes("fb.com")) return "facebook";
    if (hostname.includes("twitter") || hostname.includes("t.co")) return "twitter";
    if (hostname.includes("instagram")) return "instagram";
    if (hostname.includes("linkedin")) return "linkedin";
    if (hostname.includes("youtube")) return "youtube";
    if (hostname.includes("reddit")) return "reddit";
    if (hostname.includes("pinterest")) return "pinterest";
    if (hostname.includes("tiktok")) return "tiktok";

    // Return the hostname for other referrers
    return hostname;
  } catch {
    return "unknown";
  }
}

function shouldSkipTracking(): boolean {
  // Skip if user is logged into studio (admin)
  const studioToken = localStorage.getItem("studio_token");
  if (studioToken) return true;

  // Skip if user has opted out of tracking
  const doNotTrack = localStorage.getItem("dnt");
  if (doNotTrack === "1") return true;

  // Skip if browser Do Not Track is enabled (optional - respect user preference)
  if (navigator.doNotTrack === "1") return true;

  return false;
}

function VisitorTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Skip tracking for studio pages
    if (pathname.startsWith("/studio")) {
      return;
    }

    // Skip tracking for admin users or opted-out users
    if (shouldSkipTracking()) {
      return;
    }

    // Check if this is a new session or new page
    const sessionKey = `visited_${pathname}`;
    const hasVisitedThisPage = sessionStorage.getItem(sessionKey);

    if (!hasVisitedThisPage) {
      // Mark this page as visited in this session
      sessionStorage.setItem(sessionKey, "true");

      // Get source information
      const source = getSource();
      const utmMedium = searchParams.get("utm_medium") || undefined;
      const utmCampaign = searchParams.get("utm_campaign") || undefined;

      // Record the visit with source
      recordVisit(pathname, source, utmMedium, utmCampaign);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerInner />
    </Suspense>
  );
}
