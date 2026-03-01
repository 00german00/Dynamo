"use client";

import { useEffect, useRef } from "react";

export function PortalViewLogger({ portalId }: { portalId: string }) {
  const hasSent = useRef(false);

  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portalId, type: "page_view" }),
    }).catch(() => {});
  }, [portalId]);

  return null;
}
