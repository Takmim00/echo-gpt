import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message, chatId } = await request.json();

    const apiKey = process.env.ECHOGPT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.echogpt.live/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${apiKey}`,
      },
      body: JSON.stringify({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "EchoGPT",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("EchoGPT API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get response from EchoGPT", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "No response from assistant";

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
