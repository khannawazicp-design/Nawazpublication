import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "POLLINATIONS_API_KEY Vercel mein set nahi hai." },
        { status: 500 }
      );
    }

    const { message, history = [], subject = "General", level = "School", image } =
      await req.json();

    if (!message && !image) {
      return NextResponse.json(
        { error: "Please apna sawal likhein ya image upload karein." },
        { status: 400 }
      );
    }

    const messages: any[] = [
      {
        role: "system",
        content: `You are NawazPublication AI Tutor.
Teach ${subject} at ${level} level.
Explain in the user's language.
Give detailed step-by-step answers with examples, formulas,
and correct calculations when needed.
For image questions, read the question carefully and solve it.
If something in the image is unclear, ask the user to upload a clearer image.
Use tables and simple diagram descriptions when helpful.
Never invent unreadable text from an image.`,
      },
      ...history
        .filter((item: any) =>
          ["user", "assistant"].includes(item.role)
        )
        .slice(-10)
        .map((item: any) => ({
          role: item.role,
          content: item.content,
        })),
    ];

    const userContent: any[] = [];

    if (message) {
      userContent.push({
        type: "text",
        text: message,
      });
    }

    if (image) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: image,
          detail: "high",
        },
      });
    }

    messages.push({
      role: "user",
      content: image ? userContent : message,
    });

    const response = await fetch(
      "https://gen.pollinations.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5.4-nano",
          messages,
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Pollinations API error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "AI service error. API key, model access, ya credits check karein.",
        },
        { status: 502 }
      );
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        { error: "AI se jawab nahi mila. Dobara koshish karein." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat route error:", error);

    return NextResponse.json(
      { error: "Server error. Please dobara koshish karein." },
      { status: 500 }
    );
  }
}
