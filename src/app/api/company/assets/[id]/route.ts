import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEMO_EMAIL = 'demo@dynamo.app';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { companyId: true },
  });

  if (!user?.companyId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset || asset.companyId !== user.companyId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.asset.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
