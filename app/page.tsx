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
      const proPrompt = `Professional educational poster about ${input}, textbook style, ultra detailed, labeled, clean white background, 4k HD`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(proPrompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${Date.now()}`;
      setResultImage(imageUrl);
      setAnswer(`### 🎨 آپ کا پوسٹر تیار ہے\n> آپ کے حکم پر **"${input}"** کا پروفیشنل ڈایا گرام بنایا گیا ہے۔`);
      setLoading(false);
    } else {
      const smartPrompt = `
      You are Nawaz AI Academy, a colorful teacher.
      RULES:
      1. Detect script: If input "${input}" is Urdu script, answer in Urdu. If Roman, answer in Roman. If English, answer in English. If Hindi, answer in Hindi.
      2. Answer like a real teacher with colorful lecture.
      3. Structure MUST be like this:
         - Use ### for headings with emojis like 📌, 💡, ✅
         - IMPORTANT definitions must be in blockquote >
         - Use tables for comparison
         - Use LaTeX for math: $$ \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} $$
         - Give 1 simple daily life example in a separate point.
         - End with a short summary in a blockquote.
      4. Keep language super easy for a 10 year old, 100% correct.
      Question: ${input}
      `;
      try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(smartPrompt)}`);
        const t = await res.text();
        setAnswer(t);
      } catch { setAnswer("> ⚠️ انٹرنیٹ سلو ہے، دوبارہ کوشش کریں"); }
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', fontFamily: 'system-ui' }}>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a' }}>Nawaz AI Academy</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>آپ کا ذاتی AI ٹیچر - آسان، کلر فل، 100% صحیح</p>
      </div>

      <div style={{ width: '100%', maxWidth: '680px', marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '28px', padding: '10px 18px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span>🔍</span>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="کچھ بھی پوچھیں... جیسے میٹرکس کیا ہے؟" style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '16px' }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button onClick={handleVoice} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🎤</button>
          <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>📷</button>
        </div>
        <input ref={fileRef} type="file" hidden />
        <button onClick={handleSearch} disabled={loading} style={{ width: '100%', marginTop: '14px', padding: '14px', background: 'black', color: 'white', borderRadius: '28px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
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
                table: ({children}) => <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0', border: '1px solid #e2e8f0' }}>{children}</table></div>,
                th: ({children}) => <th style={{ background: '#0f172a', color: 'white', padding: '8px', textAlign: 'left' }}>{children}</th>,
                td: ({children}) => <td style={{ border: '1px solid #e2e8f0', padding: '8px' }}>{children}</td>,
              }}
            >
              {answer}
            </ReactMarkdown>
          </div>

          {resultImage && <img src={resultImage} style={{ width: '100%', borderRadius: '20px', marginTop: '16px', border: '1px solid #e2e8f0' }} alt="diagram" />}

          {answer && (
            <div style={{ marginTop: '20px', textAlign: 'center', background: '#eff6ff', padding: '12px', borderRadius: '12px', fontSize: '13px', color: '#1e40af' }}>
              💡 پسند آیا؟ اس لیکچر کا <b>پوسٹر بنانے کے لیے لکھیں "اس کا پوسٹر بنا دو"</b> اور HD ڈاؤن لوڈ کریں
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: '40px', fontSize: '12px', color: '#94a3b8' }}>Nawaz AI Academy · بچوں کا پسندیدہ AI ٹیچر</p>
    </div>
  );
}
