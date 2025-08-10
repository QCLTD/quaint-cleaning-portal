export async function sendEmail(payload: { to: string; subject: string; text: string; }) {
  console.log('EMAIL (dev):', payload);
}
