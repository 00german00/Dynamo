import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  const portal = await prisma.portal.findUnique({ where: { slug } });
  if (!portal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.portal.update({
    where: { slug },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.personas !== undefined ? { personas: body.personas } : {}),
      ...(body.accessMode !== undefined ? { accessMode: body.accessMode } : {}),
      ...(body.allowedEmails !== undefined ? { allowedEmails: body.allowedEmails } : {}),
    },
  });

  return NextResponse.json({ portal: updated });
}
