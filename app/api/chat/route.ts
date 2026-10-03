export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const key = process.env.GROQ_API_KEY;
    const lower = message.toLowerCase();

    let level = "general";
    if (lower.includes("class 1") || lower.includes("class 2") || lower.includes("class 3") || lower.includes("2 ke")) level = "class 2-3";
    else if (lower.includes("class 4") || lower.includes("class 5") || lower.includes("class 6") || lower.includes("class 8")) level = "class 5";
    else if (lower.includes("class 9") || lower.includes("class 10") || lower.includes("matric")) level = "class 10";
    else if (lower.includes("11") || lower.includes("12") || lower.includes("second year") || lower.includes("fsc") || lower.includes("inter")) level = "second year";
    else if (lower.includes("university") || lower.includes("bs") || lower.includes("detailed")) level = "university";

    const systemPrompt = `
You are NAWAZ AI ACADEMY by NAWAZ PUBLICATION Hangu.
RULES:
- User level is: ${level}
- If level class 2-3: Very simple, max 60 words, 3 points only.
- If level class 5: 4-5 points, 100 words, simple. (For class 8 also use this)
- If level class 10: Detailed, 5-6 points, Example, Importance, 200 words.
- If level second year: Full detailed 250-300 words.
- If level university: Very detailed 350+ words.
- If general: Class 10 level answer.
- Reply always in professional ENGLISH. Never use ** ## * symbols.
- Structure:
Definition:...
Key Points:
1....
2....
Example:...
- At end always: - NAWAZ AI ACADEMY
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
    let reply = data.choices[0].message.content.replace(/\*\*/g, "").replace(/##/g, "");
    return Response.json({ reply });
  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message });
  }
}
