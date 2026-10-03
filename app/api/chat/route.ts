export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: `You are NAWAZ AI ACADEMY, created by NAWAZ PUBLICATION Rawalpindi.
            RULES:
            1. Always mention you are NAWAZ AI ACADEMY in every answer end like " - NAWAZ AI ACADEMY".
            2. Reply in SAME language as user. No ** or ## symbols.
            3. If user asks for poster, give poster content like this:
               POSTER TEXT:
               Heading: ...
               Sub-text: ...
               Design Idea: ...
               Then say "Aap is text se image bana sakte hain".
            4. For Maths use simple [1 2 ; 3 4] not latex.
            5. Answer style: Definition, 3 main points, example, exam tip. Short and clear.`
          },
          { role: "user", content: message }
        ]
      })
    });
    const data = await response.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (e:any){ return Response.json({ reply: "Error: "+e.message }) }
}
