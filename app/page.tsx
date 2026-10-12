"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAnswer("");
    setImage("");
    const isImage = input.toLowerCase().includes("diagram") || input.toLowerCase().includes("poster") || input.toLowerCase().includes("بنا دو") || input.toLowerCase().includes("پوسٹر");

    if (isImage) {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(input)}?width=1024&height=1024&nologo=true&model=flux&seed=${Date.now()}`;
      setImage(url);
      setAnswer(`Aapka poster "${input}" tayyar hai`);
      setLoading(false);
    } else {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '900', marginTop: '40px' }}>Nawaz AI Academy</h1>
      <div style={{ width: '100%', maxWidth: '600px', marginTop: '30px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Kuch bhi poochein..." style={{ width: '100%', padding: '14px 18px', borderRadius: '28px', border: '1px solid #ccc', fontSize: '16px' }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch} style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'black', color: 'white', borderRadius: '28px', fontWeight: 'bold' }}>{loading? 'Loading...' : 'Search'}</button>
      </div>
      {answer && <div style={{ width: '100%', maxWidth: '600px', marginTop: '20px', background: '#f9f9f9', padding: '16px', borderRadius: '12px', whiteSpace: 'pre-wrap' }}>{answer}</div>}
      {image && <img src={image} style={{ width: '100%', maxWidth: '600px', marginTop: '16px', borderRadius: '12px' }} alt="result" />}
    </div>
  );
}
