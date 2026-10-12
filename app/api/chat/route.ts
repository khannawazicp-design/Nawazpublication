import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.POLLINATIONS_KEY || "";

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
       ...(apiKey? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content: `You are Nawaz AI Academy. RULES: 1. Detect user's script from "${prompt}" -> If Urdu script, answer in pure Urdu. If Roman Urdu, answer in Roman. If Hindi, answer in Hindi. If English, answer in English. 2. Explain very simple like for 10 year old, step by step, with colorful markdown, use ### for headings, > for important points, and LaTeX $$ for math.`
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Jawab nahi aya";
    return NextResponse.json({ answer });

  } catch (e) {
    return NextResponse.json({ answer: "Server error, dobara koshish karen" }, { status: 500 });
  }
}
