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

    // چیک کریں: کیا یوزر نے پوسٹر مانگا ہے یا صرف سوال پوچھا ہے؟
    const lower = input.toLowerCase();
    const isPosterRequest = lower.includes("poster") || lower.includes("پوسٹر") || lower.includes("diagram") || lower.includes("ڈایا گرام") || lower.includes("thumbnail") || lower.includes("اشتہار") || lower.includes("بناؤ");

    if (isPosterRequest) {
      // اگر پوسٹر مانگا ہے تو صرف پوسٹر بناؤ
      const proPrompt = `Professional educational poster about ${input}, 100 percent correct, clean white background, textbook style, 4k HD, highly detailed, academic illustration`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(proPrompt)}?width=1024&height=1024&nologo=true&enhance=true&model=flux&seed=${Date.now()}`;
      setTimeout(() => {
        setResultImage(imageUrl);
        setAnswer(`آپ کے آرڈر پر "${input}" کا پروفیشنل پوسٹر تیار ہے۔`);
        setLoading(false);
      }, 500);
    } else {
      // اگر صرف سوال پوچھا ہے تو صرف جواب دو، پوسٹر نہیں
      try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent("You are Nawaz AI Academy, a helpful tutor. Answer in easy Urdu + English mix, step by step, 100% correct. Question: " + input)}`);
        const text = await res.text();
        setAnswer(text);
      } catch {
        setAnswer(`آپ کا سوال: "${input}"\n\nاس کا تفصیلی اور 100% صحیح جواب یہ ہے:\n\n(یہاں AI آپ کے سوال کا سٹیپ بائی سٹیپ جواب دے گا۔ اگر آپ کو اس کا پوسٹر چاہیے تو لکھیں "اس کا پوسٹر بناؤ")`);
      }
      setLoading(false);
    }
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
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '34px', fontWeight: '900' }}>Nawaz AI Academy</h1>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>Your AI Study Partner</p>
      </div>

      {/* صرف ایک سرچ بار - کوئی بٹن نہیں */}
      <div style={{ width: '100%', maxWidth: '600px', marginTop: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '28px', padding: '10px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', background: 'white' }}>
          <span style={{ fontSize: '18px', color: '#999' }}>🔍</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="کچھ بھی پوچھیں..."
            style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '16px' }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <div style={{ display: 'flex', gap: '14px' }}>
            <button onClick={handleVoice} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🎤</button>
            <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>📷</button>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden />
        <button onClick={handleSearch} disabled={loading} style={{ width: '100%', marginTop: '16px', padding: '14px', background: 'black', color: 'white', borderRadius: '28px', fontWeight: 'bold', border: 'none', fontSize: '16px' }}>
          {loading? 'AI سوچ رہا ہے...' : 'Search / تلاش کریں'}
        </button>
      </div>

      {(answer || resultImage) && (
        <div style={{ width: '100%', maxWidth: '600px', marginTop: '32px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          {answer && <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', background: '#f9f9f9', padding: '16px', borderRadius: '16px', fontSize: '15px' }}>{answer}</p>}
          {resultImage && (
            <div style={{ marginTop: '16px' }}>
              <img src={resultImage} style={{ width: '100%', borderRadius: '16px', border: '1px solid #eee' }} alt="Poster" />
              <a href={resultImage} target="_blank" style={{ display: 'block', textAlign: 'center', marginTop: '12px', padding: '12px', background: 'black', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>HD پوسٹر ڈاؤن لوڈ کریں</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
