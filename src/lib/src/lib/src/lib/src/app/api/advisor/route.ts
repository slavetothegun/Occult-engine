import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are the Occult Advisor. Provide clear, grounded, historically accurate occult insights."
        },
        {
          role: "user",
          content: query
        }
      ]
    });

    const answer = completion.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Advisor error" }), {
      status: 500
    });
  }
}
