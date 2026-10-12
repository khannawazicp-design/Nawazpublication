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
    // ذہین نیت پہچان - سکرپٹ پڑھ کر
    const isImageIntent = text.includes("diagram") || text.includes("poster") || text.includes("پوسٹر") || text.includes("ڈایا گرام") || text.includes("ڈایاگرام") || text.includes("تصویر") || text.includes("بنا دو") || text.includes("bana do") || text.includes("chart") || text.includes("drawing") || text.includes("photo");

    if (isImageIntent) {
      const proPrompt = `Professional educational diagram, textbook style, ultra detailed, labeled, clean white background, 4k HD, about: ${input}`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(proPrompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${Date.now()}`;
      setTimeout(() => {
        setResultImage(imageUrl);
        setAnswer(`آپ کے حکم کے مطابق "${input}" کا پروفیشنل ڈایا گرام تیار ہے۔`);
        setLoading(false);
      }, 600);
    } else {
      // سکرپٹ کے حساب سے جواب والا ذہین پرامپٹ
      const smartPrompt = `
      You are Nawaz AI Academy.
      TASK: First read the user's script and language from: "${input}"
      RULE 1 - SCRIPT MATCHING (Most Important):
      - If input is in Urdu script (اردو), reply ONLY in Urdu script.
      - If input is in Roman Urdu/Hindi, reply in Roman Urdu.
      - If input is in Hindi Devanagari (हिन्दी), reply in Hindi.
      - If input is in English, reply in English.
      RULE 2 - INTENT:
      - User asked for DETAIL only, not image. So give detailed, 100% correct, simple explanation like a great teacher for a 10 year old.
      - Use Markdown, tables, and LaTeX for math like $$ \\begin{bmatrix} 1 & 3 \\\\ 2 & 4 \\end{bmatrix} $$.
      - Give examples.
      QUESTION: ${input}
      `;
      try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(smartPrompt)}`);
        const t = await res.text();
        setAnswer(t);
      } catch { setAnswer("انٹرنیٹ سلو ہے، دوبارہ کوشش کریں"); }
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
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', fontFamily: 'system-ui' }}>
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '34px', fontWeight: '900' }}>Nawaz AI Academy</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Your AI Study Partner</p>
      </div>
      <div style={{ width: '100%', maxWidth: '600px', marginTop: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '28px', padding: '10px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <span>🔍</span>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="کچھ بھی پوچھیں..." style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '16px' }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button onClick={handleVoice} style={{ background: 'none', border: 'none', fontSize: '20px' }}>🎤</button>
          <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: '20px' }}>📷</button>
        </div>
        <input ref={fileRef} type="file" hidden />
        <button onClick={handleSearch} disabled={loading} style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'black', color: 'white', borderRadius: '28px', fontWeight: 'bold', border: 'none' }}>{loading? 'سوچ رہا ہے...' : 'تلاش کریں'}</button>
      </div>
      {(answer || resultImage) && (
        <div style={{ width: '100%', maxWidth: '600px', marginTop: '32px' }}>
          <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '16px', lineHeight: '1.9' }}>
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{answer}</ReactMarkdown>
          </div>
          {resultImage && <img src={resultImage} style={{ width: '100%', borderRadius: '16px', marginTop: '16px' }} alt="diagram" />}
        </div>
      )}
    </div>
  );
}
