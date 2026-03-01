/**
 * Intent Scoring Algorithm
 * 
 * Produces a 0-100 score based on engagement depth.
 * Higher-weight interactions (ROI calculator, drive downloads) signal stronger intent.
 */

interface EventRow {
  type: string;
  blockId: string | null;
  metadata: unknown;
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

  // Check unique IPs for link sharing detection
  const uniqueIps = new Set(events.filter(e => e.type === "page_view").map(() => "unknown")); // simplified for MVP
  if (uniqueIps.size > 1) {
    insights.push("🌐 Link appears to have been shared with additional stakeholders.");
  }

  if (insights.length === 0) {
    insights.push("📊 Engagement data is still being collected. Check back soon.");
  }

  return insights;
}
