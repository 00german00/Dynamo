import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const portal = await prisma.portal.findUnique({ where: { slug } });
  if (!portal) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // Open portals don't need access checks
  if (portal.accessMode === 'open') {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(`dynamo_visitor_${slug}`, email, {
      path: `/p/${slug}`,
      maxAge: 60 * 60 * 24 * 90, // 90 days
      sameSite: 'lax',
    });
    return res;
  }

  // Restricted: validate against allowlist
  const allowedEmails = (portal.allowedEmails as string[] | null) ?? [];
  const normalizedEmail = email.trim().toLowerCase();
  const isAllowed = allowedEmails.some((e) => e.toLowerCase() === normalizedEmail);

  if (!isAllowed) {
    return NextResponse.json({ error: 'not_allowed' }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(`dynamo_visitor_${slug}`, normalizedEmail, {
    path: `/p/${slug}`,
    maxAge: 60 * 60 * 24 * 90, // 90 days
    sameSite: 'lax',
  });
  return res;
}
