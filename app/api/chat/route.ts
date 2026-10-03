export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const key = process.env.GROQ_API_KEY;
    const lower = message.toLowerCase();

    // ذہین فیصلہ: ڈایا گرام چاہیے یا نہیں؟
    const diagramKeywords = ["photosynthesis", "heart", "cell", "water cycle", "atom", "circuit", "digestive", "brain", "kidney", "plant", "leaf", "mitosis", "meiosis", "dna", "diagram", "structure", "parts of", "cross section", "labeled"];
    const noDiagramWords = ["hello", "hi", "salam", "kya haal", "general life", "joke", "shayari", "essay", "story", "motivation", "thank", "ok"];

    const needsDiagram = diagramKeywords.some(k => lower.includes(k)) &&!noDiagramWords.some(k => lower.includes(k));

    let level = "general";
    if (lower.includes("class 1") || lower.includes("class 2") || lower.includes("class 3")) level = "class 2-3";
    else if (lower.includes("class 5") || lower.includes("class 8")) level = "class 5";
    else if (lower.includes("class 9") || lower.includes("class 10") || lower.includes("matric")) level = "class 10";
    else if (lower.includes("11") || lower.includes("12") || lower.includes("fsc")) level = "second year";

    const systemPrompt = `
You are NAWAZ AI ACADEMY by NAWAZ PUBLICATION.
User level: ${level}
Rule: If user says hello, hi, general life question -> give friendly answer, NO diagram mention.
If level class 2-3: 60 words max.
If class 10: 200 words detailed with points.
Reply in professional ENGLISH, never use **.
At end: - NAWAZ AI ACADEMY
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }],
        temperature: 0.6
      })
    });
    const data = await res.json();
    let reply = data.choices[0].message.content.replace(/\*\*/g, "");
    return Response.json({ reply, needsDiagram });

  } catch (e: any) {
    return Response.json({ reply: "Error", needsDiagram: false });
  }
}
