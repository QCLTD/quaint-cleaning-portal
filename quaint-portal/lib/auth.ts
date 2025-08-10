export type DemoSession = { userId: number; organisationId: number; email: string; name: string; };
export async function getDemoSession(): Promise<DemoSession> {
  return { userId: 1, organisationId: 1, email: 'fm.sarah@acme.co.uk', name: 'Sarah FM' };
}
