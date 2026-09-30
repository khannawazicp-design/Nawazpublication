import { NextRequest, NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  // Auto language detection is inside getAIResponse
  const answer = await getAIResponse(query, 10000);
  return NextResponse.json({ answer });
}
