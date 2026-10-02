"use client";
import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function MathText({ text }: { text: string }) {
  // LaTeX ko alag karke render karna
  const parts = text.split(/(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$.*?\$|\\begin\{pmatrix\}.*?\\end\{pmatrix\})/gs);
  
  return (
    <div style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
      {parts.map((part, i) => {
        if (!part) return null;
        const isMath = part.startsWith('\\[') || part.startsWith('\\(') || part.startsWith('$') || part.includes('\\begin');
        if (isMath) {
          try {
            let latex = part.replace(/\\\[|\\\]/g, '').replace(/\\\(|\\\)/g, '').replace(/\$/g, '');
            const html = katex.renderToString(latex, { displayMode: part.includes('pmatrix') || part.startsWith('\\[') || part.startsWith('$$'), throwOnError: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <span key={i}>{part}</span>;
          }
        }
        // Normal text me ** hatana
        const clean = part.replace(/\*\*/g, '').replace(/###/g, '');
        return <span key={i}>{clean}</span>;
      })}
    </div>
  );
}

export default function Page() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (txt: string) => {
    if (!txt.trim()) return;
    setChats(p => [...p, { role: "user", text: txt }]);
    setHistory(p => [txt.slice(0, 30), ...p]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: txt }) });
      const data = await res.json();
      setChats(p => [...p, { role: "ai", text: data.reply }]);
    } catch { setChats(p => [...p, { role: "ai", text: "Error" }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui', background: '#f7f7f8' }}>
      <div style={{ width: 260, background: '#202123', color: 'white', padding: 12, display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => setChats([])} style={{ background: '#343541', padding: 12, borderRadius: 6, color: 'white', border: '1px solid #565869' }}>+ New Chat</button>
        <div style={{ marginTop: 20, fontSize: 12, color: '#8e8ea0' }}>Chat History</div>
        {history.map((h, i) => <div key={i} style={{ padding: 8, fontSize: 13, cursor: 'pointer', borderBottom: '1px solid #333' }}>{h}</div>)}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #444', paddingTop: 10 }}><b>NawazAcademy</b><br/><span style={{ color: '#f59e0b', fontSize: 12 }}>AI Ustad Dashboard</span></div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 15, background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ fontSize: 20 }}>Nawaz<span style={{ color: '#f59e0b' }}>Academy</span> - AI Ustad</b>
          <div style={{ background: '#16a34a', color: 'white', padding: '6px 15px', borderRadius: 20, fontSize: 12 }}>WhatsApp</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {chats.length === 0 ? <div style={{ textAlign: 'center', marginTop: 60 }}><h1 style={{ fontSize: 38, fontWeight: 800 }}>AI-Powered Ustad<br/>for <span style={{ color: '#f59e0b' }}>Everyone</span></h1></div>
            : chats.map((c, i) => (
              <div key={i} style={{ background: c.role === 'user' ? '#000' : 'white', color: c.role === 'user' ? 'white' : '#111', padding: 15, borderRadius: 12, marginBottom: 12, maxWidth: 750, marginLeft: c.role === 'user' ? 'auto' : 0 }}>
                {c.role === 'user' ? c.text : <MathText text={c.text} />}
              </div>
            ))}
          {loading && <div>AI likh raha hai...</div>}
        </div>
        <div style={{ padding: 15, background: 'white', borderTop: '1px solid #ddd' }}>
          <div style={{ display: 'flex', maxWidth: 700, margin: '0 auto', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Matrix ya koi sawal likhen..." style={{ flex: 1, padding: 12, borderRadius: 25, border: '1px solid #ccc' }} />
            <button onClick={() => send(input)} style={{ background: 'black', color: 'white', padding: '0 25px', borderRadius: 25 }}>Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
