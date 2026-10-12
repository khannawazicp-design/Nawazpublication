"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
    const isImageIntent = text.includes("diagram") || text.includes("poster") || text.includes("پوسٹر") || text.includes("ڈایا گرام") || text.includes("تصویر") || text.includes("بنا دو") || text.includes("bana do") || text.includes("chart");

    if (isImageIntent) {
      const proPrompt = `Professional educational poster about ${input}, textbook style, ultra detailed, labeled, clean white background, 4k HD, academic illustration`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(proPrompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${Date.now()}`;
      setResultImage(imageUrl);
      setAnswer(`### 🎨 آپ کا پوسٹر تیار ہے\n> آپ کے حکم پر **"${input}"** کا پروفیشنل ڈایا گرام بنایا گیا ہے۔`);
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
        setAnswer("> ⚠️ انٹرنیٹ سلو ہے، دوبارہ کوشش کریں");
      }
      setLoading(false);
    }
  };

  const handleVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return alert("Voice support nahi hai");
    const rec = new SR();
    rec.lang = "ur-PK";
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', fontFamily: 'system-ui' }}>
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a' }}>Nawaz AI Academy</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>آپ کا ذاتی AI ٹیچر - آسان، کلر فل، 100% صحیح</p>
      </div>

      <div style={{ width: '100%', maxWidth: '680px', marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '28px', padding: '10px 18px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span>🔍</span>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="کچھ بھی پوچھیں..." style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '16px' }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button onClick={handleVoice} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🎤</button>
          <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>📷</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden />
        <button onClick={handleSearch} disabled={loading} style={{ width: '100%', marginTop: '14px', padding: '14px', background: 'black', color: 'white', borderRadius: '28px', fontWeight: 'bold', border: 'none' }}>
          {loading? 'AI لیکچر تیار کر رہا ہے...' : 'تلاش کریں'}
        </button>
      </div>

      {(answer || resultImage) && (
        <div style={{ width: '100%', maxWidth: '680px', marginTop: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', lineHeight: '1.9', fontSize: '15px' }}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h3: ({children}) => <h3 style={{ background: '#e0f2fe', color: '#0c4a6e', padding: '8px 12px', borderRadius: '10px', marginTop: '16px', fontWeight: '800' }}>{children}</h3>,
                blockquote: ({children}) => <div style={{ background: '#fef9c3', borderLeft: '5px solid #facc15', padding: '12px 16px', borderRadius: '12px', margin: '14px 0', color: '#713f12' }}>{children}</div>,
                strong: ({children}) => <span style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: '6px', color: '#14532d', fontWeight: '800' }}>{children}</span>,
              }}
            >
              {answer}
            </ReactMarkdown>
          </div>
          {resultImage && <img src={resultImage} style={{ width: '100%', borderRadius: '20px', marginTop: '16px', border: '1px solid #e2e8f0' }} alt="poster" />}
        </div>
      )}
    </div>
  );
}
