import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { blockIds }: { blockIds: string[] } = await req.json();

  if (!Array.isArray(blockIds)) {
    return NextResponse.json({ error: 'blockIds must be an array' }, { status: 400 });
  }

  const portal = await prisma.portal.findUnique({ where: { slug } });
  if (!portal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.$transaction(
    blockIds.map((id, idx) =>
      prisma.block.updateMany({
        where: { id, portalId: portal.id },
        data: { order: idx + 1 },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
