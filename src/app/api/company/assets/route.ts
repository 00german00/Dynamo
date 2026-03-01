import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEMO_EMAIL = 'demo@dynamo.app';

async function getDemoCompanyId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { companyId: true },
  });
  return user?.companyId ?? null;
}

export async function GET(req: Request) {
  const companyId = await getDemoCompanyId();
  if (!companyId) {
    return NextResponse.json({ assets: [] });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const assets = await prisma.asset.findMany({
    where: { companyId, ...(type ? { type } : {}) },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ assets });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, dealName, acquirer, target, dealValue, year, description, logoUrl, tags, fileName, fileType, url } = body;

    if (!type || !['tombstone', 'document'].includes(type)) {
      return NextResponse.json({ error: 'Invalid asset type' }, { status: 400 });
    }

    let companyId = await getDemoCompanyId();

    if (!companyId) {
      // Bootstrap demo company + user if missing
      const company = await prisma.company.upsert({
        where: { id: 'cldemocompany0000000000000' },
        update: {},
        create: { id: 'cldemocompany0000000000000', name: 'Dynamo Demo Co.' },
      });
      await prisma.user.upsert({
        where: { email: DEMO_EMAIL },
        update: { companyId: company.id },
        create: { email: DEMO_EMAIL, name: 'Demo Sales Rep', companyId: company.id },
      });
      companyId = company.id;
    }

    const asset = await prisma.asset.create({
      data: {
        companyId,
        type,
        dealName,
        acquirer,
        target,
        dealValue,
        year: year ? Number(year) : undefined,
        description,
        logoUrl,
        tags: tags ?? [],
        fileName,
        fileType,
        url,
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error('Failed to create asset', error);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}
