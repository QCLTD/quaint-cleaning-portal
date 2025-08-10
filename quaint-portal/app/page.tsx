'use client';
import { useEffect, useState } from 'react';
type Quote = { id: number; number: string; description: string; total: string; status: 'PENDING'|'APPROVED'|'DECLINED'; property: { name: string } };
export default function Page() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  async function load() {
    try { setLoading(true); const res = await fetch('/api/quotes', { cache: 'no-store' }); const data = await res.json(); setQuotes(data.quotes); }
    catch (e:any) { setError(e.message || 'Failed to load quotes'); } finally { setLoading(false); }
  }
  useEffect(()=>{ load(); }, []);
  async function act(id: number, action: 'approve'|'decline') {
    const res = await fetch(`/api/quotes/${id}/${action}`, { method: 'POST' });
    if (!res.ok) { alert('Action failed'); return; } await load();
  }
  return (<div><h1>Quotes awaiting your decision</h1>{loading && <p>Loading…</p>}{error && <p style={{color:'crimson'}}>{error}</p>}
    <table><thead><tr><th>ID</th><th>Number</th><th>Property</th><th>Description</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>{quotes.map(q=> (<tr key={q.id}><td>{q.id}</td><td>{q.number}</td><td>{q.property?.name}</td><td>{q.description}</td><td>£{q.total}</td>
      <td>{q.status==='PENDING'&&<span className='badge yellow'>Pending</span>}{q.status==='APPROVED'&&<span className='badge green'>Approved</span>}{q.status==='DECLINED'&&<span className='badge red'>Declined</span>}</td>
      <td className='controls'><button onClick={()=>act(q.id,'decline')}>Decline</button><button className='primary' onClick={()=>act(q.id,'approve')}>Approve</button></td>
    </tr>))}</tbody></table><p style={{ color:'var(--muted)', marginTop:10 }}>This starter uses a simple demo session and logs emails to the server console.</p></div>);
}
