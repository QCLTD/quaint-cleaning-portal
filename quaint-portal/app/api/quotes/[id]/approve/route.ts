import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getDemoSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
type Params = { params: { id: string } };
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getDemoSession();
  const id = Number(params.id);
  const body = await req.json().catch(() => ({}));
  const comment = body?.comment as string | undefined;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const quote = await tx.quote.findFirst({ where: { id, organisationId: session.organisationId } });
      if (!quote) throw new Error('Quote not found');
      if (quote.status !== 'PENDING') throw new Error('Quote is not pending');
      const updated = await tx.quote.update({ where: { id }, data: { status: 'APPROVED' } });
      await tx.approval.create({ data: { organisationId: session.organisationId, quoteId: id, action: 'APPROVE', comment, actorId: session.userId } });
      await tx.auditLog.create({ data: { organisationId: session.organisationId, actorId: session.userId, event: 'QUOTE_APPROVED', targetType: 'Quote', targetId: id, meta: { comment } } });
      return updated;
    });
    await sendEmail({ to: 'ops@quaintcleaning.com', subject: `Quote ${result.number} approved`, text: `Quote ${result.number} was approved by ${session.name} (${session.email}).` });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
