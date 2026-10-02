"use client";
import { useState } from "react";

function formatText(text: string) {
  // **bold** ko hatana aur bold banana, ### ko heading banana
  return text
    .split('\n').map((line, i) => {
      let clean = line.trim();
      if (!clean) return <br key={i} />;
      
      // Heading ### ko saaf karna
      clean = clean.replace(/^###\s*/, '').replace(/^##\s*/, '').replace(/^\#\#\s*/, '');
      // **stars** hatana
      const parts = clean.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={i} style={{ marginBottom: 8, lineHeight: '1.6' }}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <b key={j}>{part.slice(2, -2)}</b>;
            }
            return <span key={j}>{part.replace(/\*/g, '')}</span>;
          })}
        </div>
      );
    });
}

export default function Page() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (txt: string) => {
    if (!txt.trim()) return;
    setChats(prev => [...prev, { role: "user", text: txt }]);
    setHistory(prev => [txt.slice(0, 30), ...prev]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: txt }) });
      const data = await res.json();
      setChats(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch { setChats(prev => [...prev, { role: "ai", text: "Error, API check karen." }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui', background: '#f7f7f8' }}>
      <div style={{ width: 260, background: '#202123', color: 'white', padding: 12, display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => setChats([])} style={{ background: '#343541', padding: 12, borderRadius: 6, color: 'white', border: '1px solid #565869' }}>+ New Chat</button>
        <div style={{ marginTop: 20, fontSize: 12, color: '#8e8ea0' }}>Chat History</div>
        {history.map((h, i) => <div key={i} onClick={() => send(h)} style={{ padding: 8, fontSize: 13, cursor: 'pointer' }}>• {h}</div>)}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #444', paddingTop: 10 }}><b>NawazAcademy</b><br/><span style={{ color: '#f59e0b', fontSize: 12 }}>AI Ustad Dashboard</span></div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 15, background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ fontSize: 20 }}>Nawaz<span style={{ color: '#f59e0b' }}>Academy</span> - AI Ustad</b>
          <a href="#" style={{ background: '#16a34a', color: 'white', padding: '6px 15px', borderRadius: 20, textDecoration: 'none' }}>WhatsApp</a>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {chats.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 60 }}>
              <h1 style={{ fontSize: 38, fontWeight: 800 }}>AI-Powered Ustad<br/>for <span style={{ color: '#f59e0b' }}>Everyone</span></h1>
              <p style={{ color: '#666' }}>English ya Urdu me sawaal likhen</p>
            </div>
          ) : chats.map((c, i) => (
            <div key={i} style={{ background: c.role === 'user' ? '#000' : 'white', color: c.role === 'user' ? 'white' : '#111', padding: 15, borderRadius: 12, marginBottom: 12, maxWidth: 750, marginLeft: c.role === 'user' ? 'auto' : 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {c.role === 'user' ? c.text : formatText(c.text)}
            </div>
          ))}
          {loading && <div style={{ color: '#888' }}>AI Ustad likh raha hai...</div>}
        </div>
        <div style={{ padding: 15, background: 'white', borderTop: '1px solid #ddd' }}>
          <div style={{ display: 'flex', maxWidth: 700, margin: '0 auto', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="English ya Urdu me sawal likhen..." style={{ flex: 1, padding: 12, borderRadius: 25, border: '1px solid #ccc' }} />
            <button onClick={() => send(input)} style={{ background: 'black', color: 'white', padding: '0 25px', borderRadius: 25 }}>Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
