import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing 'query' in request body" },
        { status: 400 }
      );
    }

    // Create embedding for the user's question
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query
    });

    const vector = embedding.data[0].embedding;

    // Query Supabase for similar documents
    const { data, error } = await supabaseServer.rpc(
      "match_documents",
      {
        query_embedding: vector,
        match_threshold: 0.75,
        match_count: 5
      }
    );

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: data });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
