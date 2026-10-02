"use client";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<{role:string,text:string}[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (txt: string) => {
    if (!txt.trim()) return;
    setChats(p => [...p, { role: "user", text: txt }]);
    setHistory(p => [txt.slice(0, 35), ...p]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: txt }) });
      const data = await res.json();
      setChats(p => [...p, { role: "ai", text: data.reply }]);
    } catch { setChats(p => [...p, { role: "ai", text: "Error" }]); }
    setLoading(false);
  };

    const cleanMath = (t: string) => {
  return t
    .replace(/\\begin\{.*?\}/g, "[")
    .replace(/\\end\{.*?\}/g, "]")
    .replace(/\\[a-z]+/g, "")
    .replace(/\{|\}/g, "")
    .replace(/\$/g, "")
    .replace(/_/g, "")
    .replace(/\*\*/g, "");
}

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', background: '#f5f5f5' }}>
      <div style={{ width: 260, background: '#202123', color: 'white', padding: 12, display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => setChats([])} style={{ background: '#343541', color: 'white', padding: 10, borderRadius: 6, border: '1px solid #555' }}>+ New Chat</button>
        <div style={{ marginTop: 15, fontSize: 12, color: '#aaa' }}>Chat History</div>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: 5 }}>{history.map((h, i) => <div key={i} style={{ padding: '8px 0', fontSize: 13, borderBottom: '1px solid #333' }}>{h}</div>)}</div>
        <div style={{ borderTop: '1px solid #444', paddingTop: 10, fontSize: 13 }}><b>NawazAcademy</b><br/><span style={{ color: '#f59e0b' }}>AI Ustad</span></div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 15, background: 'white', borderBottom: '1px solid #ddd' }}><b>Nawaz<span style={{ color: '#f59e0b' }}>Academy</span> - AI Ustad</b></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {chats.length === 0 ? <div style={{ textAlign: 'center', marginTop: 80 }}><h1 style={{ fontSize: 32, fontWeight: 800 }}>AI-Powered Ustad<br/><span style={{ color: '#f59e0b' }}>for Everyone</span></h1></div> : chats.map((c, i) => <div key={i} style={{ background: c.role === 'user' ? 'black' : 'white', color: c.role === 'user' ? 'white' : 'black', padding: 14, borderRadius: 10, marginBottom: 10, maxWidth: 700, whiteSpace: 'pre-wrap', fontSize: 14, marginLeft: c.role === 'user' ? 'auto' : 0 }}>{cleanMath(c.text)}</div>)}
          {loading && <div>AI likh raha hai...</div>}
        </div>
        <div style={{ padding: 12, background: 'white', borderTop: '1px solid #ddd', display: 'flex', gap: 8, maxWidth: 700, margin: '0 auto', width: '100%' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Matrix ya sawal..." style={{ flex: 1, padding: 12, borderRadius: 20, border: '1px solid #ccc' }} />
          <button onClick={() => send(input)} style={{ background: 'black', color: 'white', padding: '0 20px', borderRadius: 20 }}>Search</button>
        </div>
      </div>
    </div>
  );
}
