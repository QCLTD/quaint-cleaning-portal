import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const org = await prisma.organisation.create({ data: { name: 'Acme Property Management', billingEmail: 'accounts@acmepm.co.uk' } });
  const riverview = await prisma.property.create({ data: { name: 'Riverview Apartments', organisationId: org.id, address: '1 River St, London' } });
  const granary = await prisma.property.create({ data: { name: 'Granary Wharf', organisationId: org.id, address: '22 Wharf Rd, London' } });
  await prisma.user.create({ data: { name: 'Sarah FM', email: 'fm.sarah@acme.co.uk', organisationId: org.id, role: 'MANAGER' } });
  await prisma.quote.create({ data: {
    organisationId: org.id, propertyId: riverview.id, number: 'Q-1024', description: 'Replace lobby light fittings with 5x LED',
    subtotal: 350, vat: 70, total: 420, expiresAt: new Date(Date.now()+1000*60*60*24*14),
    items: { create: [{ name: 'LED fittings x5', qty: 5, unitPrice: 60, lineTotal: 300 }, { name: 'Labour (1h)', qty: 1, unitPrice: 50, lineTotal: 50 }] }
  }});
  await prisma.quote.create({ data: {
    organisationId: org.id, propertyId: granary.id, number: 'Q-1025', description: 'Water ingress clean & dehumidifiers (B1 hallway)',
    subtotal: 575, vat: 115, total: 690, expiresAt: new Date(Date.now()+1000*60*60*24*18),
    items: { create: [{ name: 'Dehumidifier rental (2 days)', qty: 2, unitPrice: 80, lineTotal: 160 }, { name: 'Technician (3h)', qty: 3, unitPrice: 55, lineTotal: 165 }, { name: 'Materials', qty: 1, unitPrice: 250, lineTotal: 250 }] }
  }});
  await prisma.quote.create({ data: {
    organisationId: org.id, propertyId: riverview.id, number: 'Q-1026', description: 'Void clean – Flat 12A',
    subtotal: 192, vat: 38.4, total: 230.4, expiresAt: new Date(Date.now()+1000*60*60*24*20),
    items: { create: [{ name: 'Void clean', qty: 1, unitPrice: 192, lineTotal: 192 }] }
  }});
  console.log('Seed done');
}
main().finally(()=>prisma.$disconnect());
