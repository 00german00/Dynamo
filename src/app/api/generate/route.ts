import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeContextFromUrl } from '@/lib/scraper';
import { generatePortalBlocks } from '@/lib/ai/tasks/generatePortal';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { url, kbContext } = await req.json();

    // Scrape the target URL for context
    const scrapedContent = url ? await scrapeContextFromUrl(url) : '';

    // Bootstrap demo company + user
    const company = await prisma.company.upsert({
      where: { id: 'cldemocompany0000000000000' },
      update: {},
      create: { id: 'cldemocompany0000000000000', name: 'Dynamo Demo Co.' },
    });

    const user = await prisma.user.upsert({
      where: { email: 'demo@dynamo.app' },
      update: { companyId: company.id },
      create: { email: 'demo@dynamo.app', name: 'Demo Sales Rep', companyId: company.id },
    });

    // Fetch company tombstones from Asset Library
    const rawAssets = await prisma.asset.findMany({
      where: { companyId: company.id, type: 'tombstone' },
    });

    const tombstones = rawAssets.map((a) => ({
      dealName: a.dealName ?? '',
      acquirer: a.acquirer ?? '',
      target: a.target ?? '',
      dealValue: a.dealValue ?? '',
      year: a.year ?? new Date().getFullYear(),
      description: a.description ?? '',
      logoUrl: a.logoUrl ?? undefined,
      tags: (a.tags as string[] | null) ?? [],
    }));

    // Generate portal blocks via the AI abstraction layer
    const generatedBlocks = await generatePortalBlocks({
      url,
      scrapedContent,
      kbContext: kbContext || '',
      tombstones,
    });

    const slug = Math.random().toString(36).substring(2, 8);
    let companyMatch = 'Prospect';
    try {
      if (url) companyMatch = new URL(url).hostname.replace('www.', '').split('.')[0];
    } catch { /* ignore parse errors */ }

    // Save the entire portal layout and modular blocks to the database
    await prisma.portal.create({
      data: {
        slug,
        title: `Dynamo + ${companyMatch}`,
        companyName: companyMatch,
        userId: user.id,
        blocks: {
          create: generatedBlocks.map((block, idx) => ({
            type: block.type,
            content: block.content,
            order: idx + 1,
          })),
        },
      },
    });

    return NextResponse.json({ slug });
  } catch (error) {
    console.error('Failed to generate portal', error);
    return NextResponse.json({ error: 'Failed to generate the portal.' }, { status: 500 });
  }
}
