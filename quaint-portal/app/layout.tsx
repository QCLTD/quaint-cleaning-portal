import './globals.css';
import Image from 'next/image';
export const metadata = { title: 'Quaint Client Portal (Starter)', description: 'Quotes approval demo' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body style={{ fontFamily: 'Inter, system-ui, Arial' }}>
      <header style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderBottom:'1px solid #e5e7eb' }}>
        <Image src="/logo.jpg" alt="Quaint Cleaning" width={40} height={40} />
        <div style={{ fontWeight:600 }}>Quaint Client Portal — Demo</div>
      </header>
      <main style={{ maxWidth:960, margin:'0 auto', padding:20 }}>{children}</main>
    </body></html>
  );
}
