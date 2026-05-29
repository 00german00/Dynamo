import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PortalEditor } from './PortalEditor';

export const dynamic = 'force-dynamic';

export default async function EditPortalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const portal = await prisma.portal.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });

  if (!portal) return notFound();

  const data = {
    id: portal.id,
    slug: portal.slug,
    title: portal.title,
    companyName: portal.companyName ?? '',
    personas: (portal.personas as string[] | null) ?? [],
    accessMode: portal.accessMode,
    allowedEmails: (portal.allowedEmails as string[] | null) ?? [],
    blocks: portal.blocks.map((b) => ({
      id: b.id,
      type: b.type,
      order: b.order,
      content: b.content as Record<string, unknown>,
      personas: (b.personas as string[] | null) ?? [],
    })),
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PortalEditor portal={data} />
    </div>
  );
}
