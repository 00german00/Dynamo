import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { PortalViewLogger } from './PortalViewLogger';
import { PersonaFilteredPortal } from './PersonaFilteredPortal';
import { PortalEmailGate } from './PortalEmailGate';

export default async function PortalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const portal = await prisma.portal.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { order: 'asc' } } }
  });

  if (!portal) return notFound();

  // Resolve viewer identity from cookie
  const cookieStore = await cookies();
  const viewerEmail = cookieStore.get(`dynamo_visitor_${slug}`)?.value ?? null;

  // Access gate: if restricted, validate viewer before rendering
  if (portal.accessMode === 'restricted') {
    const allowedEmails = (portal.allowedEmails as string[] | null) ?? [];
    const isAllowed = viewerEmail
      ? allowedEmails.some((e) => e.toLowerCase() === viewerEmail.toLowerCase())
      : false;

    if (!isAllowed) {
      return (
        <PortalEmailGate
          slug={slug}
          companyName={portal.companyName || 'the team'}
        />
      );
    }
  }

  const personas = (portal.personas as string[] | null) ?? [];

  const blocks = portal.blocks.map((block) => ({
    id: block.id,
    type: block.type,
    order: block.order,
    content: block.content,
    personas: (block.personas as string[] | null) ?? [],
  }));

  return (
    <div className="min-h-screen bg-neutral-950 font-sans selection:bg-indigo-500/30 antialiased">
      {/* Fire a page-level view event on mount */}
      <PortalViewLogger portalId={portal.id} viewerEmail={viewerEmail} />

      {/* Top utility bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-3 flex justify-between items-center text-xs font-medium text-neutral-500 sticky top-0 z-50">
        <span>Prepared securely for {portal.companyName || "the team"}</span>
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Connection
        </span>
      </div>

      <PersonaFilteredPortal
        portalId={portal.id}
        blocks={blocks}
        personas={personas}
        viewerEmail={viewerEmail}
      />
    </div>
  );
}
