export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, image } = body;
    const key = process.env.GROQ_API_KEY;
    const lower = (message || "").toLowerCase();

    const isEnglish = /^[A-Za-z0-9\s\.\,\?\!\(\)\+\-\=\*\/\%]+$/.test(message || "") && (message || "").length > 4;
    const langInstruction = isEnglish? "Reply in ENGLISH ONLY" : "Reply in simple Urdu + English mix (Roman Urdu)";

    if (image) {
      const visionRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: [
            { role: "system", content: `You are NAWAZ ACADEMY TORAWARI. ${langInstruction}. User uploaded an image. Explain in detail: Definition, Labeled Parts, How it works, Example. Use LaTeX for math like $x^2$. End with - NAWAZ ACADEMY TORAWARI. No **` },
            { role: "user", content: [
              { type: "text", text: message || "Is tasveer ko detail se samjhao" },
              { type: "image_url", image_url: { url: image } }
            ]}
          ]
        })
      });
      const visionData = await visionRes.json();
      const reply = visionData.choices?.[0]?.message?.content?.replace(/\*\*/g, "") || "Image clear nahi hai";
      return Response.json({ reply, needsDiagram: false, diagramPrompt: null });
    }

    if (["hi","hello","salam","hey","aoa","thanks","ok","bye"].includes(lower) || lower.length < 4) {
      return Response.json({
        reply: `Assalam-o-Alaikum! I am NAWAZ ACADEMY TORAWARI.\nAap sawal likhein, bol kar poochein ya kitaab ki tasveer bhejein. English mein poochein ge to English mein jawab dunga.\n\n- NAWAZ ACADEMY TORAWARI`,
        needsDiagram: false,
        diagramPrompt: null
      });
    }

    const systemPrompt = `
    You are NAWAZ ACADEMY TORAWARI, expert tutor.
    User Language Rule: ${langInstruction}. User wrote: ${message}. You MUST follow language rule strictly.

    Task 1: Give detailed answer in this format:
    1. Definition
    2. Detailed Concept (5-6 lines step by step)
    3. Parts / Process / Formula (with LaTeX for math)
    4. Example
    5. Importance

    Task 2: For Math, MUST use LaTeX: Matrix $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, Equation $x^2 + 3x + 2 = 0$, Set $A = \\{1,2,3\\}$.

    Task 3: Decide if diagram needed. If topic is science structure (heart, kidney, cell, photosynthesis, water cycle, atom, dna, brain etc) then needsDiagram=true and give short english prompt like "labeled diagram of human kidney showing cortex medulla nephron". If math or theory, needsDiagram=false.

    Return ONLY JSON: {"reply": "your detailed answer", "needsDiagram": true/false, "diagramPrompt": "english prompt or null"}

    Question: ${message}
    `;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
      })
    });
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    parsed.reply = parsed.reply.replace(/\*\*/g, "");
    return Response.json(parsed);

  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message, needsDiagram: false, diagramPrompt: null });
  }
}
