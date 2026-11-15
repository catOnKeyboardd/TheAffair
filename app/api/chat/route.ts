// RAYMOND OWNS THIS FILE.
// Contract: POST { personaId, messages } -> { reply }
// Right now it returns canned lines. Swap the body for a real LLM call using
// persona.backstory as the system prompt; keep the request/response shape.

import { NextResponse } from "next/server";
import { getPersona } from "@/lib/personas";
import type { ChatRequest, ChatResponse } from "@/lib/types";

const canned = [
  "haha stop 🙈",
  "is that a leather jacket or are you just happy to see me",
  "ok but what's your roadmap for us",
  "my friends say you're only interested in me for my specs",
  "let's take this offline. like, a datacenter.",
];

export async function POST(req: Request) {
  const { personaId, messages } = (await req.json()) as ChatRequest;
  const persona = getPersona(personaId);
  if (!persona) return NextResponse.json({ error: "unknown persona" }, { status: 404 });

  const reply = canned[messages.length % canned.length];
  return NextResponse.json<ChatResponse>({ reply });
}
