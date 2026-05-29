import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { portalId, type, blockId, viewerEmail, metadata } = await req.json();

    if (!portalId || !type) {
      return NextResponse.json({ error: 'portalId and type are required' }, { status: 400 });
    }

    // Extract IP from headers (best-effort for local dev)
    const forwarded = req.headers.get('x-forwarded-for');
    const ipAddress = forwarded?.split(',')[0]?.trim() || 'unknown';

    await prisma.event.create({
      data: {
        portalId,
        type,
        blockId: blockId || null,
        ipAddress,
        viewerEmail: viewerEmail || null,
        metadata: metadata || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
