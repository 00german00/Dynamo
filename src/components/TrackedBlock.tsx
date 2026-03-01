"use client";

import { useEffect, useRef, useCallback } from "react";

interface TrackedBlockProps {
  portalId: string;
  blockId: string;
  blockType: string;
  children: React.ReactNode;
}

/**
 * Wraps any Modular Block component to automatically track:
 * 1. When the block enters the viewport ("view" event)
 * 2. How long the user dwells on the block ("time_on_block" event on exit)
 */
export function TrackedBlock({ portalId, blockId, blockType, children }: TrackedBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const entryTime = useRef<number | null>(null);
  const hasLoggedView = useRef(false);

  const sendEvent = useCallback(
    (type: string, metadata?: Record<string, unknown>) => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portalId, type, blockId, metadata }),
      }).catch(() => {}); // fire-and-forget
    },
    [portalId, blockId]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entryTime.current = Date.now();
          if (!hasLoggedView.current) {
            sendEvent("view", { blockType });
            hasLoggedView.current = true;
          }
        } else if (entryTime.current) {
          const durationSeconds = Math.round((Date.now() - entryTime.current) / 1000);
          if (durationSeconds > 1) {
            sendEvent("time_on_block", { blockType, durationSeconds });
          }
          entryTime.current = null;
        }
      },
      { threshold: 0.4 } // 40% of the block must be visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [blockType, sendEvent]);

  return <div ref={ref}>{children}</div>;
}
