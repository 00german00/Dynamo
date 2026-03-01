import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string; blockId: string }> }
) {
  const { slug, blockId } = await params;
  const body = await req.json();

  const portal = await prisma.portal.findUnique({ where: { slug } });
  if (!portal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const block = await prisma.block.findUnique({ where: { id: blockId } });
  if (!block || block.portalId !== portal.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.block.update({
    where: { id: blockId },
    data: {
      ...(body.content !== undefined ? { content: body.content } : {}),
      ...(body.personas !== undefined ? { personas: body.personas } : {}),
    },
  });

  return NextResponse.json({ block: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string; blockId: string }> }
) {
  const { slug, blockId } = await params;

  const portal = await prisma.portal.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });
  if (!portal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const block = portal.blocks.find((b) => b.id === blockId);
  if (!block) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    await tx.block.delete({ where: { id: blockId } });
    const remaining = portal.blocks.filter((b) => b.id !== blockId);
    for (let i = 0; i < remaining.length; i++) {
      await tx.block.update({ where: { id: remaining[i].id }, data: { order: i + 1 } });
    }
  });

  return new NextResponse(null, { status: 204 });
}
