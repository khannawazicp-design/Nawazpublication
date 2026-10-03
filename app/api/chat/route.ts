export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const key = process.env.GROQ_API_KEY;
    const lower = message.toLowerCase().trim();

    // 1. یہ ذہین فلٹر ہے - اس میں ڈایا گرام نہیں بنے گی
    const noDiagram = ["hi", "hello", "salam", "aslam", "kya haal", "thanks", "thank you", "ok", "bye", "general", "joke", "shayari", "motivation", "life"];
    const isGreeting = noDiagram.some(w => lower === w || lower.startsWith(w + " ") || lower.length < 6);

    // 2. صرف ان ٹاپکس پر ڈایا گرام بنے گی
    const diagramNeeded = ["photosynthesis", "heart", "cell", "atom", "water cycle", "digestive", "brain", "kidney", "leaf", "flower", "dna", "mitosis", "circuit", "plant", "respiration", "structure", "diagram", "labeled"];

    const needsDiagram =!isGreeting && diagramNeeded.some(k => lower.includes(k));

    // کلاس لیول سسٹم
    let level = "general";
    if (lower.includes("class 1") || lower.includes("class 2") || lower.includes("class 3")) level = "class 2-3";
    else if (lower.includes("class 4") || lower.includes("class 5") || lower.includes("class 6") || lower.includes("class 8")) level = "class 5-8";
    else if (lower.includes("class 9") || lower.includes("class 10") || lower.includes("matric")) level = "class 10";
    else if (lower.includes("11") || lower.includes("12") || lower.includes("fsc")) level = "second year";

    const systemPrompt = `You are NAWAZ AI ACADEMY. User level: ${level}. If greeting like hi/hello -> reply friendly short, no points. For study: Definition, Key Points, Example. No ** symbols. At end: - NAWAZ AI ACADEMY`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai/gpt-oss-20b", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }] })
    });
    const data = await res.json();
    return Response.json({ reply: data.choices[0].message.content.replace(/\*\*/g,""), needsDiagram });
  } catch (e: any) {
    return Response.json({ reply: "Error", needsDiagram: false });
  }
}
