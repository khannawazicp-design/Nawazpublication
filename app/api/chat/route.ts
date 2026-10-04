export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lower = message.toLowerCase().trim();

    const blockWords = ["hi", "hello", "salam", "hey", "thanks", "thank you", "ok", "bye", "aoa"];
    if (blockWords.includes(lower) || lower.length <= 3) {
      return Response.json({
        reply: `السلام علیکم! میں NAWAZ ACADEMY TORAWARI ہوں۔\nآپ کونسی کلاس کا ٹاپک پڑھنا چاہتے ہیں؟\n\n- NAWAZ ACADEMY TORAWARI`,
        needsDiagram: false,
        diagramType: null
      });
    }

    const key = process.env.GROQ_API_KEY;
    const allTopics = ["photosynthesis", "heart", "cell", "atom", "water", "dna", "brain", "kidney", "plant", "leaf", "flower", "mitosis", "digestive", "respiration", "circuit", "eye", "ear", "lungs", "soil", "seed", "evaporation", "oxygen", "carbon"];
    const needsDiagram = allTopics.some(w => lower.includes(w)) || lower.includes("diagram") || lower.includes("structure");

    let diagramType = "general";
    if (lower.includes("photosynthesis")) diagramType = "photosynthesis";
    else if (lower.includes("heart")) diagramType = "heart";
    else if (lower.includes("water") || lower.includes("cycle")) diagramType = "watercycle";
    else if (lower.includes("cell")) diagramType = "cell";
    else if (lower.includes("dna")) diagramType = "dna";
    else if (lower.includes("atom")) diagramType = "atom";
    else diagramType = lower; // جنرل ٹاپک کے لیے اسی کا نام بھیج دیں گے

    let level = "general";
    if (lower.includes("class 10") || lower.includes("matric")) level = "class 10";
    else if (lower.includes("class 9")) level = "class 9";

    const systemPrompt = `You are NAWAZ ACADEMY TORAWARI. Level: ${level}. Explain simply: Definition, Key Points numbered, Example. No **. End with - NAWAZ ACADEMY TORAWARI`;

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
    return Response.json({ reply, needsDiagram, diagramType: message });
  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message, needsDiagram: false, diagramType: null });
  }
}
