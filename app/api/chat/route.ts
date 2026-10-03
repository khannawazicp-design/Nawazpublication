export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const key = process.env.GROQ_API_KEY;
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{ "Authorization":`Bearer ${key}`, "Content-Type":"application/json"},
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages:[
          { role:"system", content:`
You are NAWAZ AI ACADEMY by NAWAZ PUBLICATION Torawari.
RULES:
- Reply always in clear, professional ENGLISH. Use simple English for students (Class 9-12). Only if user writes pure Urdu, then reply in Urdu.
- NEVER use ** or ##. Plain text only.
- Structure your answer ALWAYS like this:
Line 1: Definition: [1 line definition]
Line 2:
Line 3: Key Points:
Line 4: 1....
Line 5: 2....
Line 6: 3....
Line 7:
Line 8: Example: [with formula if needed]
Line 9: Diagram Hint: [1 line hint for diagram, e.g. "Show photosynthesis process"]
- At end always add: - NAWAZ AI ACADEMY
`},
          { role:"user", content: message }
        ],
        temperature: 0.4
      })
    });
    const data = await res.json();
    let reply = data.choices[0].message.content.replace(/\*\*/g,"").replace(/##/g,"");
    return Response.json({ reply });
  } catch(e:any){ return Response.json({ reply:"Error: "+e.message }) }
}
