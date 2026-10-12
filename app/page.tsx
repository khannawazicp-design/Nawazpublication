"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function Home() {
  const [input, setInput] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResultImage("");
    setAnswer("");
    const text = input.toLowerCase();
    const isImageIntent = text.includes("diagram") || text.includes("poster") || text.includes("پوسٹر") || text.includes("ڈایا گرام") || text.includes("تصویر") || text.includes("bana do") || text.includes("بنا دو");

    if (isImageIntent) {
      const prompt = `Professional educational poster about ${input}, textbook style, labeled, clean white background, 4k`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${Date.now()}`;
      setResultImage(imageUrl);
      setAnswer(`### 🎨 Poster Tayyar Hai\n> **"${input}"** ka professional diagram neeche hai.`);
      setLoading(false);
    } else {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input }),
        });
        const data = await res.json();
        setAnswer(data.answer);
      } catch {
        setAnswer("Internet slow hai, dobara koshish karein");
      }
      setLoading(false);
    }
  };

  const handleVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "ur-PK";
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: '900', marginTop: '40px' }}>Nawaz AI Academy</h1>
      <div style={{ width: '100%', maxWidth: '680px', marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #ddd', borderRadius: '28px', padding: '10px 18px', background: 'white' }}>
          <span>🔍</span>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Kuch bhi poochein..." style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '16px' }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button onClick={handleVoice} style={{ background: 'none', border: 'none', fontSize: '20px' }}>🎤</button>
          <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: '20px' }}>📷</button>
        </div>
        <input ref={fileRef} type="file" hidden />
        <button onClick={handleSearch} disabled={loading} style={{ width: '100%', marginTop: '14px', padding: '14px', background: 'black', color: 'white', borderRadius: '28px', fontWeight: 'bold', border: 'none' }}>{loading? 'Soach raha hai...' : 'Search'}</button>
      </div>
      {(answer || resultImage) && (
        <div style={{ width: '100%', maxWidth: '680px', marginTop: '30px', background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{answer}</ReactMarkdown>
          {resultImage && <img src={resultImage} style={{ width: '100%', borderRadius: '16px', marginTop: '16px' }} alt="poster" />}
        </div>
      )}
    </div>
  );
}
