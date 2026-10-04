export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const key = process.env.GROQ_API_KEY;
    if (!key) return Response.json({ reply: "GROQ_API_KEY Vercel mein nahi laga", needsDiagram: false, diagramType: null });

    const msg = message || "";
    const lower = msg.toLowerCase();

    const urduWords = ["kya","hai","kaise","ka","ki","ko","mein","yeh","samjhao","batao","gurda","dil","zara","thoda"];
    const isUrdu = /[\u0600-\u06FF]/.test(msg) || urduWords.some(w => lower.includes(w));
    const langRule = isUrdu? "Reply in Roman Urdu + Simple Urdu mix." : "Reply in Simple ENGLISH ONLY.";

    if (image) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: [
            { role: "system", content: `You are NAWAZ ACADEMY TORAWARI. ${langRule} Give detailed colorful answer. End with - NAWAZ ACADEMY TORAWARI` },
            { role: "user", content: [{ type: "text", text: msg }, { type: "image_url", image_url: { url: image } }] }
          ]
        })
      });
      const d = await res.json();
      return Response.json({ reply: d.choices?.[0]?.message?.content || "Image clear nahi", needsDiagram: false, diagramType: null });
    }

    let diagramType: string | null = null;
    if (lower.includes("kidney") || lower.includes("gurda")) diagramType = "kidney";
    else if (lower.includes("heart")) diagramType = "heart";
    else if (lower.includes("photo")) diagramType = "photosynthesis";
    else if (lower.includes("force") || lower.includes("f = ma")) diagramType = "force";
    else if (lower.includes("mitos") || lower.includes("cell") || lower.includes("derivative")) diagramType = "cell";

    const systemPrompt = `You are NAWAZ ACADEMY TORAWARI.
    LANGUAGE: ${langRule}

    IMPORTANT RULES:
    1. Give DETAILED answer like ChatGPT - minimum 300 words. Not short.
    2. Use headings: Definition, Concept, Formula/Process, Example, Importance, Summary.
    3. MATH RULE - BANNED: Never write \\frac, \\lim, \\to, \\text, \\(, \\)
    4. ALWAYS write simple math: $f'(x) = lim h->0 [f(x+h) - f(x)] / h$, $F = m x a$, $F = 5 kg x 2 m/s² = 10 N$
    5. End with - NAWAZ ACADEMY TORAWARI

    Topic: ${msg}`;

    const models = ["llama-3.3-70b-versatile", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];
    let finalReply = null;
    for (const model of models) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msg }], temperature: 0.5, max_tokens: 2000 })
        });
        const data = await res.json();
        if (data.choices?.[0]?.message?.content) { finalReply = data.choices[0].message.content.replace(/\*\*/g,""); break; }
      } catch { continue; }
    }

    if (!finalReply) finalReply = "Server busy, dobara try karein - NAWAZ ACADEMY TORAWARI";
    return Response.json({ reply: finalReply, needsDiagram:!!diagramType, diagramType });
  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message, needsDiagram: false, diagramType: null });
  }
}
