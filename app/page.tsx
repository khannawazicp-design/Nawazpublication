"use client";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<{role: string, text: string}[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (txt: string) => {
    if (!txt.trim()) return;
    const userText = txt;
    setChats(prev => [...prev, { role: "user", text: userText }]);
    setHistory(prev => [userText.slice(0, 30), ...prev]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setChats(prev => [...prev, { role: "ai", text: data.reply || "Jawab nahi mila" }]);
    } catch {
      setChats(prev => [...prev, { role: "ai", text: "Error: API Key check karen" }]);
    }
    setLoading(false);
  };

  const cleanText = (t: string) => {
    return t
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/\\\[/g, "")
      .replace(/\\\]/g, "")
      .replace(/\\\(/g, "")
      .replace(/\\\)/g, "")
      .replace(/\\mathbb\{N\}/g, "N")
      .replace(/\\mathbb\{R\}/g, "R")
      .replace(/\\to/g, " -> ");
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', background: '#f5f5f5' }}>
      <div style={{ width: 260, background: '#202123', color: 'white', padding: 12, display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => setChats([])} style={{ background: '#343541', color: 'white', padding: 10, borderRadius: 6, border: '1px solid #555' }}>+ New Chat</button>
        <div style={{ marginTop: 15, fontSize: 12, color: '#aaa' }}>Chat History</div>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: 5 }}>
          {history.map((h, i) => (
            <div key={i} style={{ padding: '8px 0', fontSize: 13, borderBottom: '1px solid #333', cursor: 'pointer' }}>{h}</div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #444', paddingTop: 10, fontSize: 13 }}><b>NawazAcademy</b><br/><span style={{ color: '#f59e0b' }}>AI Ustad Dashboard</span></div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 15, background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
          <b>Nawaz<span style={{ color: '#f59e0b' }}>Academy</span> - AI Ustad</b>
          <div style={{ background: '#16a34a', color: 'white', padding: '5px 12px', borderRadius: 20, fontSize: 12 }}>WhatsApp</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {chats.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 80 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800 }}>AI-Powered Ustad<br/><span style={{ color: '#f59e0b' }}>for Everyone</span></h1>
              <p>English ya Urdu me sawal likhen</p>
            </div>
          ) : (
            chats.map((c, i) => (
              <div key={i} style={{ background: c.role === 'user' ? 'black' : 'white', color: c.role === 'user' ? 'white' : 'black', padding: 14, borderRadius: 10, marginBottom: 10, maxWidth: 700, whiteSpace: 'pre-wrap', marginLeft: c.role === 'user' ? 'auto' : 0 }}>{cleanText(c.text)}</div>
            ))
          )}
          {loading && <div style={{ color: '#888' }}>AI Ustad likh raha hai...</div>}
        </div>

        <div style={{ padding: 12, background: 'white', borderTop: '1px solid #ddd', display: 'flex', gap: 8, maxWidth: 700, margin: '0 auto', width: '100%' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Sawal likhen..." style={{ flex: 1, padding: 12, borderRadius: 20, border: '1px solid #ccc' }} />
          <button onClick={() => send(input)} style={{ background: 'black', color: 'white', padding: '0 20px', borderRadius: 20 }}>Search</button>
        </div>
      </div>
    </div>
  );
}
