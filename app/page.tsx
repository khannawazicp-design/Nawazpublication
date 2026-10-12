"use client";
import { useState } from "react";

const CATEGORIES = [
  { id: "math", label: "میتھس پوسٹر", icon: "📐", prompt: "Mathematically correct educational poster, textbook style, white background, step by step solution, 4k, no error" },
  { id: "science", label: "سائنس ڈایا گرام", icon: "🔬", prompt: "Highly detailed labeled scientific diagram, white background, professional school book illustration, 4k" },
  { id: "islamic", label: "اسلامی پوسٹر", icon: "🕌", prompt: "Beautiful Islamic poster, Arabic calligraphy 100% correct, elegant mosque pattern, spiritual, 4k" },
  { id: "business", label: "کاروباری اشتہار", icon: "💼", prompt: "Modern professional advertisement poster, commercial, bold Urdu text, premium look, 4k" },
  { id: "social", label: "سوشل میڈیا", icon: "📱", prompt: "Viral YouTube thumbnail, bold 3D text, high contrast, attractive, 4k" },
];

export default function Home() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePoster = async () => {
    if (!prompt.trim()) return alert("براہ کرم پہلے کچھ لکھیں");
    setLoading(true);
    setImage("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: prompt, category: category.id }),
      });
      const data = await res.json();
      if (data.imageUrl) setImage(data.imageUrl);
      else alert("پوسٹر بنانے میں مسئلہ آیا");
    } catch (e) {
      alert("انٹرنیٹ کا مسئلہ ہے، دوبارہ کوشش کریں");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 flex flex-col items-center">
      <h1 className="text-[28px] font-extrabold mt-6">AI پروفیشنل پوسٹر میکر</h1>
      <p className="text-zinc-400 text-sm mb-6">لکھیں، بولیں یا تصویر لگائیں - 100% پرفیکٹ</p>

      <div className="grid grid-cols-3 gap-2 w-full max-w-[420px] mb-5">
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCategory(c)}
            className={`p-3 rounded-2xl border text-center transition-all ${category.id === c.id? "bg-white text-black border-white scale-105" : "bg-zinc-900 border-zinc-800 text-zinc-300"}`}>
            <div className="text-xl">{c.icon}</div>
            <div className="text-[11px] mt-1 font-bold">{c.label}</div>
          </button>
        ))}
      </div>

      <div className="w-full max-w-[420px]">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder={`یہاں لکھیں... جیسے: ${category.label} بناؤ - If a=2, b=3`}
          className="w-full h-28 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:border-white text-sm" />
        <button onClick={generatePoster} disabled={loading}
          className="w-full mt-3 p-4 bg-white text-black font-bold rounded-2xl disabled:opacity-50">
          {loading? "پروفیشنل پوسٹر بن رہا ہے... ✨" : "پوسٹر بنائیں ✨"}
        </button>

        {image && (
          <div className="mt-6 p-2 bg-zinc-900 rounded-2xl border border-zinc-800">
            <img src={image} alt="poster" className="w-full rounded-xl" />
            <a href={image} target="_blank" download={`poster-${Date.now()}.png`}
              className="block text-center mt-3 p-3 bg-white text-black font-bold rounded-xl text-sm">
              HD ڈاؤن لوڈ کریں
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
