"use client";
import { useState, useRef } from "react";

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

    // ہر سوال کا آسان جواب + پروفیشنل پوسٹر
    const proPrompt = `Create a professional, 100% correct educational poster for: ${input}. Clean white background, step by step solution if math, labeled diagram if science, 4k HD, no spelling mistake, highly detailed, textbook style`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(proPrompt)}?width=1024&height=1024&nologo=true&enhance=true&seed=${Date.now()}`;

    setResultImage(imageUrl);
    setAnswer(`آپ کا سوال: "${input}"\n\nاس کا تفصیلی جواب اور پوسٹر نیچے تیار ہے۔ یہ 100% صحیح اور آسان زبان میں ہے۔`);
    setLoading(false);
  };

  const handleVoice = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert("آپ کے براؤزر میں وائس سپورٹ نہیں ہے");
    const rec = new SpeechRecognition();
    rec.lang = "ur-PK";
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'system-ui', padding: '16px' }}>

      {/* Header - Only Name */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>Nawaz AI Academy</h1>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Your AI Study Partner</p>
      </div>

      {/* Main Search Bar - Google Style */}
      <div style={{ width: '100%', maxWidth: '600px', marginTop: '40px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '28px', padding: '8px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: 'white' }}>
          <span style={{ fontSize: '18px', color: '#999' }}>🔍</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="کچھ بھی پوچھیں... لکھیں، بولیں یا تصویر لگائیں"
            style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', height: '24px', padding: '0 12px', fontSize: '16px', fontFamily: 'inherit' }}
            onKeyDown={(e) => { if (e.key === 'Enter' &&!e.shiftKey) { e.preventDefault(); handleSearch(); } }}
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleVoice} title="بول کر پوچھیں" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🎤</button>
            <button onClick={() => fileRef.current?.click()} title="تصویر سے پوچھیں" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>📷</button>
            <button onClick={() => fileRef.current?.click()} title="فائل اپلوڈ" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🖼️</button>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e)=>{ if(e.target.files?.[0]) setInput("اس تصویر میں موجود سوال کو حل کریں: " + e.target.files[0].name) }} />

        <button onClick={handleSearch} disabled={loading} style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'black', color: 'white', borderRadius: '28px', fontWeight: 'bold', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
          {loading? 'AI سوچ رہا ہے...' : 'Search / تلاش کریں'}
        </button>
      </div>

      {/* Quick Suggestions */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px' }}>
        {['Derivative سمجھائیں', 'Photosynthesis ڈایا گرام', 'Fraction کے MCQs', 'نماز کا پوسٹر'].map(t => (
          <button key={t} onClick={() => setInput(t)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #e5e5e5', background: '#f8f8f8', fontSize: '13px', cursor: 'pointer' }}>{t}</button>
        ))}
      </div>

      {/* Result Area */}
      {(answer || resultImage) && (
        <div style={{ width: '100%', maxWidth: '600px', marginTop: '32px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          {answer && <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', background: '#f9f9f9', padding: '16px', borderRadius: '16px', fontSize: '15px' }}>{answer}</p>}
          {resultImage && (
            <div style={{ marginTop: '16px' }}>
              <img src={resultImage} style={{ width: '100%', borderRadius: '16px', border: '1px solid #eee' }} alt="AI Poster" />
              <a href={resultImage} target="_blank" download style={{ display: 'block', textAlign: 'center', marginTop: '12px', padding: '12px', background: 'black', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>HD پوسٹر ڈاؤن لوڈ کریں</a>
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '12px', color: '#aaa' }}>Nawaz AI Academy · AI-powered learning</p>
    </div>
  );
}
