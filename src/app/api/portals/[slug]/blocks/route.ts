import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  const portal = await prisma.portal.findUnique({
    where: { slug },
    include: { blocks: { select: { order: true } } },
  });
  if (!portal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const maxOrder = portal.blocks.reduce((m, b) => Math.max(m, b.order), 0);

  const block = await prisma.block.create({
    data: {
      portalId: portal.id,
      type: body.type,
      content: body.content,
      order: maxOrder + 1,
      personas: body.personas ?? [],
    },
  });

  return NextResponse.json({ block }, { status: 201 });
}
