import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  try {
    const r = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
    const text = await r.text();
    return NextResponse.json({ answer: text });
  } catch {
    return NextResponse.json({ answer: "Error, dobara koshish karen" });
  }
}
