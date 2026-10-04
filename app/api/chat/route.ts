export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const key = process.env.GROQ_API_KEY;
    const lower = message.toLowerCase().trim();

    // --- ڈبل لاک: یہاں سے Hi پر ڈایا گرام بند ---
    const blockWords = ["hi", "hello", "salam", "hey", "thanks", "thank you", "ok", "bye", "kya haal", "joke"];
    const isGreeting = blockWords.includes(lower) || lower.length <= 4;

    const diagramWords = ["photosynthesis", "heart", "cell", "atom", "water cycle", "dna", "brain", "kidney", "plant", "leaf", "flower", "mitosis", "meiosis", "digestive", "respiration", "circuit", "structure", "diagram"];
    const needsDiagram =!isGreeting && diagramWords.some(w => lower.includes(w));

    let level = "general";
    if (lower.includes("class 1") || lower.includes("class 2") || lower.includes("class 3")) level = "class 2-3";
    else if (lower.includes("class 4") || lower.includes("class 5") || lower.includes("class 6") || lower.includes("class 8")) level = "class 5-8";
    else if (lower.includes("class 9") || lower.includes("class 10") || lower.includes("matric")) level = "class 10";
    else if (lower.includes("11") || lower.includes("12") || lower.includes("fsc")) level = "second year";

    const systemPrompt = `You are NAWAZ AI ACADEMY. User level: ${level}. If greeting like hi/hello, give short friendly reply only, no points. For study: Definition, Key Points with numbers, Example. Never use **. At end add - NAWAZ AI ACADEMY`;

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
