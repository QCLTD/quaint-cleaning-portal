import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getDemoSession } from '@/lib/auth';
type Params = { params: { id: string } };
export async function GET(_req: Request, { params }: Params) {
  const session = await getDemoSession();
  const id = Number(params.id);
  const quote = await prisma.quote.findFirst({ where: { id, organisationId: session.organisationId }, include: { property: true, items: true, approvals: true } });
  if (!quote) return new NextResponse('Not found', { status: 404 });
  return NextResponse.json(quote);
}
