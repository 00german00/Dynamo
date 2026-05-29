/**
 * Intent Scoring Algorithm
 * 
 * Produces a 0-100 score based on engagement depth.
 * Higher-weight interactions (ROI calculator, drive downloads) signal stronger intent.
 */

interface EventRow {
  type: string;
  blockId: string | null;
  ipAddress?: string | null;
  viewerEmail?: string | null;
  metadata: unknown;
  createdAt?: Date;
}

// Block types ranked by "buying intent" signal strength
const BLOCK_WEIGHT: Record<string, number> = {
  roi: 5,                  // Interacting with ROI = very high intent
  drive: 4,                // Downloading docs = high intent
  timeline: 3,             // Reading implementation = medium-high
  tombstone_carousel: 3,   // Reviewing deal history = medium-high
  proof: 2,                // Looking at case studies = moderate
  hook: 1,                 // Reading the headline = baseline
};

export function calculateIntentScore(events: EventRow[]): number {
  if (events.length === 0) return 0;

  let rawScore = 0;

  // Page views: 5 points each (capped at 25)
  const pageViews = events.filter((e) => e.type === "page_view").length;
  rawScore += Math.min(pageViews * 5, 25);

  // Block views: 3 points each
  const blockViews = events.filter((e) => e.type === "view");
  rawScore += blockViews.length * 3;

  // Time on block: weighted by block type and duration
  const timeEvents = events.filter((e) => e.type === "time_on_block");
  for (const ev of timeEvents) {
    const meta = ev.metadata as { blockType?: string; durationSeconds?: number } | null;
    if (!meta) continue;
    const weight = BLOCK_WEIGHT[meta.blockType || ""] || 1;
    const duration = Math.min(meta.durationSeconds || 0, 120); // cap at 2 mins per block
    rawScore += weight * Math.ceil(duration / 10); // every 10 seconds = weight points
  }

  // Normalize to 0-100
  return Math.min(Math.round(rawScore), 100);
}

/**
 * Derive actionable insights from events.
 */
export function deriveInsights(events: EventRow[]): string[] {
  const insights: string[] = [];

  // Check for high-intent block engagement
  const roiTime = events
    .filter((e) => e.type === "time_on_block" && (e.metadata as { blockType?: string })?.blockType === "roi")
    .reduce((sum, e) => sum + ((e.metadata as { durationSeconds?: number })?.durationSeconds || 0), 0);

  if (roiTime > 30) {
    insights.push(`🔥 Prospect spent ${roiTime}s on the ROI calculator — strong buying signal.`);
  }

  const driveViews = events.filter(
    (e) => e.type === "view" && (e.metadata as { blockType?: string })?.blockType === "drive"
  ).length;
  if (driveViews > 0) {
    insights.push("📄 Prospect viewed the Shared Drive — they may be reviewing legal/security docs.");
  }

  // Check for multi-session visits
  const pageViews = events.filter((e) => e.type === "page_view").length;
  if (pageViews >= 3) {
    insights.push(`🔁 Portal has been opened ${pageViews} times — high revisit rate.`);
  }

  // Detect sharing via unique IPs or emails
  const pageViewEvents = events.filter(e => e.type === "page_view");
  const uniqueEmails = new Set(pageViewEvents.map(e => e.viewerEmail).filter(Boolean));
  const uniqueIps = new Set(pageViewEvents.map(e => e.ipAddress).filter(ip => ip && ip !== "unknown"));

  if (uniqueEmails.size > 1) {
    insights.push(`🌐 ${uniqueEmails.size} different people have opened this portal.`);
  } else if (uniqueEmails.size === 0 && uniqueIps.size > 1) {
    insights.push(`🌐 Link appears to have been shared — ${uniqueIps.size} different IPs detected.`);
  }

  if (insights.length === 0) {
    insights.push("📊 Engagement data is still being collected. Check back soon.");
  }

  return insights;
}

export interface VisitorRow {
  key: string;         // email if known, else IP
  isEmail: boolean;
  intentScore: number;
  totalDwellSeconds: number;
  visitCount: number;
  lastSeen: Date | null;
}

/**
 * Groups events by viewer identity (email > IP > "unknown") and returns
 * per-visitor stats for the signals dashboard.
 */
export function getVisitorBreakdown(events: EventRow[]): VisitorRow[] {
  const map = new Map<string, EventRow[]>();

  for (const ev of events) {
    const key = ev.viewerEmail
      ? ev.viewerEmail.toLowerCase()
      : (ev.ipAddress && ev.ipAddress !== "unknown" ? ev.ipAddress : "unknown");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }

  const rows: VisitorRow[] = [];

  for (const [key, visitorEvents] of map.entries()) {
    const visitCount = visitorEvents.filter(e => e.type === "page_view").length;
    const totalDwellSeconds = visitorEvents
      .filter(e => e.type === "time_on_block")
      .reduce((sum, e) => sum + ((e.metadata as { durationSeconds?: number })?.durationSeconds || 0), 0);
    const lastSeen = visitorEvents.reduce((latest, e) => {
      if (!e.createdAt) return latest;
      return !latest || e.createdAt > latest ? e.createdAt : latest;
    }, null as Date | null);

    rows.push({
      key,
      isEmail: !!(visitorEvents[0]?.viewerEmail),
      intentScore: calculateIntentScore(visitorEvents),
      totalDwellSeconds,
      visitCount,
      lastSeen,
    });
  }

  // Sort by intent score descending
  return rows.sort((a, b) => b.intentScore - a.intentScore);
}
