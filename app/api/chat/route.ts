export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lower = message.toLowerCase().trim();

    const blockWords = ["hi", "hello", "salam", "hey", "thanks", "thank you", "ok", "bye", "aoa", "assalam"];
    const isGreeting = blockWords.includes(lower) || lower.length <= 4;

    if (isGreeting) {
      return Response.json({
        reply: `Assalam-o-Alaikum! I am NAWAZ AI ACADEMY.\nHow can I help you in your studies today?\n\n- NAWAZ AI ACADEMY`,
        needsDiagram: false
      });
    }

    const key = process.env.GROQ_API_KEY;
    const diagramWords = ["photosynthesis", "heart", "cell", "atom", "water cycle", "dna", "brain", "kidney", "plant", "leaf", "flower", "mitosis", "digestive", "respiration", "circuit", "structure", "diagram"];
    const needsDiagram = diagramWords.some(w => lower.includes(w));

    let level = "general";
    if (lower.includes("class 1") || lower.includes("class 2") || lower.includes("class 3")) level = "class 2-3";
    else if (lower.includes("class 4") || lower.includes("class 5") || lower.includes("class 6") || lower.includes("class 8")) level = "class 5-8";
    else if (lower.includes("class 9") || lower.includes("class 10") || lower.includes("matric")) level = "class 10";
    else if (lower.includes("11") || lower.includes("12") || lower.includes("fsc")) level = "second year";

    const systemPrompt = `You are NAWAZ AI ACADEMY. User level: ${level}. Explain topic in simple words: Definition, Key Points with numbers, Example. Never use **. End with - NAWAZ AI ACADEMY`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
      })
    });
    const data = await res.json();
    const reply = data.choices[0].message.content.replace(/\*\*/g, "");
    return Response.json({ reply, needsDiagram });
  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message, needsDiagram: false });
  }
}
