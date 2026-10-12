"use client";

import { useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CATEGORIES = [
  { id: "math", label: "Mathematics", icon: "📐" },
  { id: "science", label: "Science", icon: "🔬" },
  { id: "islamic", label: "Islamic", icon: "🕌" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "social", label: "Social Media", icon: "📱" },
];

const starterQuestions = [
  "Explain derivatives step by step",
  "Explain photosynthesis with a diagram",
  "Create 10 MCQs about fractions",
];

export default function Home() {
  const [mode, setMode] = useState<"tutor" | "poster">("tutor");
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [level, setLevel] = useState("School");
  const [messages, setMessages] = useState<Message[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("math");
  const [posterPrompt, setPosterPrompt] = useState("");
  const [posterImage, setPosterImage] = useState("");
  const [posterBusy, setPosterBusy] = useState(false);
  const [posterError, setPosterError] = useState("");

  async function readImage(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("براہ کرم PNG، JPG یا WEBP تصویر منتخب کریں۔");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError("تصویر 6 MB سے کم ہونی چاہیے۔");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(String(reader.result || ""));
      setImageName(file.name);
      setError("");
    };
    reader.onerror = () => setError("تصویر پڑھنے میں مسئلہ آیا۔");
    reader.readAsDataURL(file);
  }

  async function askTutor(textOverride?: string) {
    const currentQuestion = (textOverride ?? question).trim();
    if (!currentQuestion && !imageDataUrl) {
      setError("اپنا سوال لکھیں یا سوال کی تصویر اپ لوڈ کریں۔");
      return;
    }

    setBusy(true);
    setError("");

    const nextMessages: Message[] = [
      ...messages,
      ...(currentQuestion
        ? [{ role: "user" as const, content: currentQuestion }]
        : imageName
          ? [{ role: "user" as const, content: `Uploaded question image: ${imageName}` }]
          : []),
    ];
    setMessages(nextMessages);
    setQuestion("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          subject,
          level,
          imageDataUrl: imageDataUrl || undefined,
          history: messages.slice(-8),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.answer) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
      setImageDataUrl("");
      setImageName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI جواب حاصل نہیں ہوا۔ دوبارہ کوشش کریں۔");
      setMessages(messages);
    } finally {
      setBusy(false);
    }
  }

  async function generatePoster() {
    if (!posterPrompt.trim()) {
      setPosterError("پہلے پوسٹر کی تفصیل لکھیں۔");
      return;
    }

    setPosterBusy(true);
    setPosterError("");
    setPosterImage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: posterPrompt.trim(),
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || `Poster request failed (${response.status})`);
      }

      setPosterImage(data.imageUrl);
    } catch (e) {
      setPosterError(e instanceof Error ? e.message : "پوسٹر نہیں بن سکا۔ دوبارہ کوشش کریں۔");
    } finally {
      setPosterBusy(false);
    }
  }

  function downloadPoster() {
    if (!posterImage) return;
    const link = document.createElement("a");
    link.href = posterImage;
    link.download = "NawazPublication-poster.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-3 py-5 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 text-center">
          <div className="mb-2 text-4xl">📚</div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            NawazPublication
          </h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Your AI Tutor, Study Partner and Poster Maker
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Learn clearly. Practice confidently. Create visually.
          </p>
        </header>

        <nav className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2">
          <button
            onClick={() => setMode("tutor")}
            className={`rounded-xl px-3 py-3 text-sm font-bold sm:text-base ${
              mode === "tutor"
                ? "bg-cyan-300 text-slate-950"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            📖 AI Tutor
          </button>
          <button
            onClick={() => setMode("poster")}
            className={`rounded-xl px-3 py-3 text-sm font-bold sm:text-base ${
              mode === "poster"
                ? "bg-cyan-300 text-slate-950"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            🎨 Poster Maker
          </button>
        </nav>

        {mode === "tutor" ? (
          <section className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:grid-cols-2">
              <label className="text-sm text-slate-300">
                Subject
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-300"
                >
                  {[
                    "General",
                    "Mathematics",
                    "English",
                    "Urdu",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "Computer Science",
                    "Islamic Studies",
                    "History",
                    "Geography",
                    "Education / Pedagogy",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-300">
                Learning level
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-300"
                >
                  {[
                    "Class 1–5",
                    "Class 6–8",
                    "Class 9–10",
                    "Class 11–12",
                    "College",
                    "University",
                    "School",
                    "Beginner",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            {messages.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-lg font-bold">What would you like to learn?</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ask a question, request a worked solution, practice MCQs, or upload a picture of a question.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {starterQuestions.map((item) => (
                    <button
                      key={item}
                      onClick={() => askTutor(item)}
                      disabled={busy}
                      className="rounded-full border border-slate-700 px-3 py-2 text-left text-xs text-slate-200 hover:border-cyan-300 hover:bg-slate-800 disabled:opacity-50"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Study conversation</h2>
                  <button
                    onClick={() => {
                      setMessages([]);
                      setError("");
                    }}
                    className="text-xs text-cyan-300 hover:underline"
                  >
                    New chat
                  </button>
                </div>

                {messages.map((m, i) => (
                  <article
                    key={`${i}-${m.role}`}
                    className={`rounded-xl p-3 sm:p-4 ${
                      m.role === "user"
                        ? "ml-3 bg-slate-800 sm:ml-12"
                        : "mr-3 border border-slate-700 bg-slate-950 sm:mr-12"
                    }`}
                  >
                    <p className="mb-2 text-xs font-bold text-cyan-300">
                      {m.role === "user" ? "You" : "Nawaz AI Tutor"}
                    </p>
                    <div className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-100">
                      {m.content}
                    </div>
                  </article>
                ))}

                {busy && (
                  <div className="rounded-xl bg-slate-950 p-4 text-sm text-cyan-200">
                    AI آپ کے سوال پر کام کر رہا ہے، براہ کرم انتظار کریں…
                  </div>
                )}
              </div>
            )}

            {imageDataUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-cyan-800 bg-slate-900 p-3">
                <img
                  src={imageDataUrl}
                  alt="Uploaded question"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{imageName}</p>
                  <p className="text-xs text-slate-400">Image ready to send</p>
                </div>
                <button
                  onClick={() => {
                    setImageDataUrl("");
                    setImageName("");
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="px-2 text-sm text-red-300"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:p-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!busy) void askTutor();
                  }
                }}
                placeholder="اپنا سوال یہاں لکھیں… مثال: Derivative کو مثالوں کے ساتھ سمجھائیں"
                rows={4}
                className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => void readImage(e.target.files?.[0])}
                  className="hidden"
                  id="question-image"
                />
                <label
                  htmlFor="question-image"
                  className="cursor-pointer rounded-xl border border-slate-700 px-3 py-3 text-sm text-slate-200 hover:bg-slate-800"
                >
                  📷 Upload question
                </label>
                <button
                  onClick={() => void askTutor()}
                  disabled={busy}
                  className="ml-auto rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Please wait…" : "Ask AI →"}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                PNG/JPG/WEBP, maximum 6 MB. Press Enter to send, Shift+Enter for a new line.
              </p>
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-800 bg-red-950/60 p-3 text-sm text-red-200">
                {error}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
              <h2 className="text-xl font-extrabold">AI Professional Poster Maker</h2>
              <p className="mt-1 text-sm text-slate-400">
                Describe the poster you want. Specify the language and exact wording for best results.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`rounded-xl border p-3 text-sm font-semibold ${
                      category === c.id
                        ? "border-cyan-300 bg-cyan-300 text-slate-950"
                        : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500"
                    }`}
                  >
                    <span className="mr-2">{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>

              <label className="mt-4 block text-sm font-semibold text-slate-200">
                Poster instructions
              </label>
              <textarea
                value={posterPrompt}
                onChange={(e) => setPosterPrompt(e.target.value)}
                rows={5}
                placeholder="مثال: Army Public School and College Thall Cantt کے لیے خوبصورت، پروفیشنل اردو داخلہ پوسٹر بنائیں۔"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"
              />

              <button
                onClick={() => void generatePoster()}
                disabled={posterBusy}
                className="mt-3 w-full rounded-xl bg-cyan-300 p-4 font-extrabold text-slate-950 hover:bg-cyan-200 disabled:opacity-50"
              >
                {posterBusy ? "Creating your poster… please wait" : "✨ Generate Poster"}
              </button>

              {posterError && (
                <div role="alert" className="mt-3 rounded-xl border border-red-800 bg-red-950/60 p-3 text-sm text-red-200">
                  {posterError}
                </div>
              )}

              {posterImage && (
                <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-3">
                  <img
                    src={posterImage}
                    alt="Generated poster"
                    className="mx-auto w-full rounded-lg"
                  />
                  <button
                    onClick={downloadPoster}
                    className="mt-3 w-full rounded-xl bg-white p-3 font-bold text-slate-950 hover:bg-slate-200"
                  >
                    ⬇ Download Poster
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="mt-8 border-t border-slate-800 py-5 text-center text-xs text-slate-500">
          NawazPublication · AI-powered learning and creativity
        </footer>
      </div>
    </main>
  );
}
