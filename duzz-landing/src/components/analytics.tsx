"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Store referral param
    const ref = searchParams.get("ref");
    if (ref) {
      sessionStorage.setItem("duzz_ref", ref);
    }
  }, [searchParams]);

  useEffect(() => {
    // Track page view
    trackEvent("page_view", { path: pathname });
  }, [pathname]);

  return null;
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  );
}

export function trackEvent(event: string, properties?: Record<string, string>) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties);
  }

  // Send to your analytics endpoint
  // Replace with PostHog / GA when ready:
  // posthog.capture(event, properties);
  // gtag('event', event, properties);

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics",
        JSON.stringify({ event, properties, timestamp: Date.now() })
      );
    }
  } catch {
    // Silent fail for analytics
  }
}
