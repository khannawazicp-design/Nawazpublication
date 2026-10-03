"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagram: string | null }
type Chat = { id: string, title: string, msgs: Msg[] }

function makeRealDiagram(topic: string) {
  const clean = topic.replace(/class \d+|diagram|explain/gi, "").trim()
  const prompt = `Realistic detailed textbook diagram of ${clean}, biology book illustration, labeled cross section, colorful, high detail, white background, professional educational, 4k`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&model=flux&enhance=true&nologo=true&seed=${Date.now()}`
}

export default function Home() {
  //... آپ کا باقی سارا کوڈ وہی رہے گا...
  // صرف send() فنکشن یہ والا لگائیں:

  async function send() {
    if (!input.trim()) return;
    const q = input; setInput(""); setLoading(true)

    // پہلے میسج بھیجو بغیر ڈایا گرام کے
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: [...c.msgs, { q, a: "...", diagram: null }] } : c))

    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: q }) })
    const d = await res.json()

    // ذہین چیک: اگر ضرورت ہوئی تو ہی ڈایا گرام بناؤ
    let diagramUrl = null
    if (d.needsDiagram) {
      diagramUrl = makeRealDiagram(q)
    }

    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, diagram: diagramUrl } : m) } : c))
    setLoading(false)
  }

  // باقی ڈیزائن وہی جو آپ کے اسکرین شاٹ میں ہے
  // جہاں تصویر شو ہوتی ہے:
  // {m.diagram && <img src={m.diagram}... />}
}
