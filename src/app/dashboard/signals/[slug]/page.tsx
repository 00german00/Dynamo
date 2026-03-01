import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { calculateIntentScore, deriveInsights } from "@/lib/intent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Clock, Zap, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SignalsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const portal = await prisma.portal.findUnique({
    where: { slug },
    include: {
      events: { orderBy: { createdAt: "desc" } },
      blocks: { orderBy: { order: "asc" } },
    },
  });

  if (!portal) return notFound();

  const intentScore = calculateIntentScore(portal.events);
  const insights = deriveInsights(portal.events);

  // Aggregate stats
  const pageViews = portal.events.filter((e) => e.type === "page_view").length;
  const blockViews = portal.events.filter((e) => e.type === "view").length;
  const totalDwell = portal.events
    .filter((e) => e.type === "time_on_block")
    .reduce((sum, e) => sum + ((e.metadata as { durationSeconds?: number })?.durationSeconds || 0), 0);

  // Per-block dwell breakdown
  const blockDwellMap: Record<string, number> = {};
  for (const ev of portal.events.filter((e) => e.type === "time_on_block")) {
    const meta = ev.metadata as { blockType?: string; durationSeconds?: number } | null;
    if (!meta?.blockType) continue;
    blockDwellMap[meta.blockType] = (blockDwellMap[meta.blockType] || 0) + (meta.durationSeconds || 0);
  }

  // Determine score color
  const scoreColor =
    intentScore >= 70 ? "text-emerald-400" : intentScore >= 40 ? "text-amber-400" : "text-neutral-400";
  const scoreBg =
    intentScore >= 70 ? "from-emerald-500/20" : intentScore >= 40 ? "from-amber-500/20" : "from-neutral-500/20";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="hover:bg-neutral-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{portal.title}</h1>
          <p className="text-neutral-500 text-sm mt-1">Signal Dashboard — Real-time engagement analytics</p>
        </div>
      </div>

      {/* Intent Score Hero */}
      <Card className={`bg-gradient-to-br ${scoreBg} to-neutral-900 border-neutral-800 overflow-hidden relative`}>
        <CardContent className="py-10 flex flex-col items-center text-center">
          <p className="text-neutral-400 text-sm font-semibold uppercase tracking-widest mb-3">Intent Score</p>
          <div className={`text-8xl font-black tabular-nums ${scoreColor}`}>{intentScore}</div>
          <p className="text-neutral-500 text-sm mt-3 max-w-sm">
            {intentScore >= 70
              ? "🔥 Hot lead — consider reaching out now."
              : intentScore >= 40
              ? "⚡ Warming up — prospect is engaged."
              : "📊 Early stage — keep monitoring."}
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-6 flex flex-col items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <div className="text-3xl font-bold text-white">{pageViews}</div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Page Views</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-6 flex flex-col items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div className="text-3xl font-bold text-white">{blockViews}</div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Block Views</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-6 flex flex-col items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <div className="text-3xl font-bold text-white">{totalDwell}s</div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Total Dwell</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="py-6 flex flex-col items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <div className="text-3xl font-bold text-white">{portal.blocks.length}</div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Blocks</p>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Insights */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">Actionable Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-300 font-medium"
            >
              {insight}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Per-Block Dwell Breakdown */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">Block-Level Engagement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {portal.blocks.map((block: { id: string; type: string }) => {
            const dwell = blockDwellMap[block.type] || 0;
            const barWidth = totalDwell > 0 ? Math.round((dwell / totalDwell) * 100) : 0;
            return (
              <div key={block.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-neutral-200 capitalize">{block.type}</span>
                  <span className="text-neutral-500">{dwell}s</span>
                </div>
                <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(barWidth, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Events Log */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {portal.events.length === 0 ? (
            <p className="text-neutral-500 text-sm">No events recorded yet. Share the portal link to start tracking.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {portal.events.slice(0, 30).map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-neutral-950 border border-neutral-800"
                >
                  <span className="font-mono text-indigo-300">{ev.type}</span>
                  <span className="text-neutral-500">
                    {new Date(ev.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
