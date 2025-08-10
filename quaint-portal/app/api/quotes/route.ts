import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getDemoSession } from '@/lib/auth';
export async function GET(req: NextRequest) {
  const session = await getDemoSession();
  const url = new URL(req.url);
  const status = url.searchParams.get('status') as 'PENDING'|'APPROVED'|'DECLINED'|null;
  const quotes = await prisma.quote.findMany({
    where: { organisationId: session.organisationId, ...(status ? { status } : {}) },
    include: { property: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ quotes: quotes.map(q => ({ id: q.id, number: q.number, description: q.description, total: q.total.toString(), status: q.status, property: { name: q.property?.name || '' } })) });
}
