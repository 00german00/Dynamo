import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Globe, ExternalLink, CalendarDays, BarChart3, Pencil } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const portals = await prisma.portal.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { blocks: true } } }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Portals</h1>
          <p className="text-neutral-400 mt-2">Manage your context-driven sales microsites.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4" /> New Portal
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portals.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800 flex flex-col items-center justify-center py-12 text-center col-span-full border-dashed">
            <div className="bg-neutral-800/50 p-4 rounded-full mb-4 ring-1 ring-neutral-700">
                <Globe className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="font-semibold text-lg">No portals yet</h3>
            <p className="text-neutral-500 text-sm max-w-sm mt-1 mb-6">
                You haven&apos;t generated any sales portals. Click the button above to ingest context and build your first one.
            </p>
            <Link href="/dashboard/create">
                <Button variant="outline" className="border-neutral-700 hover:bg-neutral-800">
                  Generate First Portal
                </Button>
            </Link>
          </Card>
        ) : (
          portals.map((portal) => (
            <Card key={portal.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:-translate-y-1 transition duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[100px] -z-10 group-hover:bg-indigo-500/10 transition-colors" />
              <div className="p-6">
                 <h3 className="font-bold text-xl mb-1 truncate text-white">{portal.title}</h3>
                 <p className="text-neutral-500 text-sm mb-6 flex items-center gap-2">
                   <CalendarDays className="w-4 h-4" /> 
                   {new Date(portal.createdAt).toLocaleDateString()}
                 </p>
                 <div className="flex items-center justify-between">
                   <div className="text-xs font-semibold bg-neutral-800 py-1 px-3 rounded-full text-indigo-300">
                     {portal._count.blocks} Blocks Assembled
                   </div>
                   <div className="flex gap-2">
                     <Link href={`/dashboard/edit/${portal.slug}`}>
                       <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-neutral-800 hover:text-white font-medium text-neutral-400">
                          <Pencil className="w-3 h-3" /> Edit
                       </Button>
                     </Link>
                     <Link href={`/dashboard/signals/${portal.slug}`}>
                       <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-neutral-800 hover:text-white font-medium text-neutral-400">
                          <BarChart3 className="w-3 h-3" /> Signals
                       </Button>
                     </Link>
                     <Link href={`/p/${portal.slug}`}>
                       <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-neutral-800 hover:text-white group-hover:bg-white group-hover:text-black transition-colors font-medium">
                          View Live <ExternalLink className="w-3 h-3" />
                       </Button>
                     </Link>
                   </div>
                 </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
