"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ChatMessage, Match, Persona, ProfileItem } from "./types";
import { getPersona } from "./personas";

type Store = {
  matches: Match[];
  seen: string[]; // persona ids already liked or skipped
  like: (persona: Persona, item: ProfileItem, comment: string) => void;
  skip: (persona: Persona) => void;
  send: (personaId: string, text: string) => Promise<void>;
  markRead: (personaId: string) => void;
  typing: Record<string, boolean>;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = "theaffair-state-v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchReply(personaId: string, messages: ChatMessage[]): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaId, messages }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return data.reply;
  } catch {
    // Demo safety net: never let a dead API break the stage demo
    return "sorry my wifi is doing a thing 😅 say that again?";
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Persist so an accidental refresh mid-demo doesn't wipe everything
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s) {
        setMatches(s.matches ?? []);
        setSeen(s.seen ?? []);
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ matches, seen }));
    } catch {}
  }, [matches, seen, loaded]);

  const append = (personaId: string, msg: ChatMessage, unread: boolean) =>
    setMatches((ms) =>
      ms.map((m) => (m.personaId === personaId ? { ...m, messages: [...m.messages, msg], unread } : m)),
    );

  const like = useCallback((persona: Persona, item: ProfileItem, comment: string) => {
    setSeen((s) => [...s, persona.id]);
    const first: ChatMessage = { id: uid(), from: "me", text: comment, likedItem: item };
    setMatches((ms) => [{ personaId: persona.id, messages: [first], unread: false }, ...ms]);
    // Opening line arrives after a beat
    setTyping((t) => ({ ...t, [persona.id]: true }));
    setTimeout(() => {
      setTyping((t) => ({ ...t, [persona.id]: false }));
      append(persona.id, { id: uid(), from: "them", text: persona.openingLine }, true);
    }, 1800);
  }, []);

  const skip = useCallback((persona: Persona) => setSeen((s) => [...s, persona.id]), []);

  const send = useCallback(
    async (personaId: string, text: string) => {
      const mine: ChatMessage = { id: uid(), from: "me", text };
      const history = [...(matches.find((m) => m.personaId === personaId)?.messages ?? []), mine];
      append(personaId, mine, false);
      setTyping((t) => ({ ...t, [personaId]: true }));
      const [reply] = await Promise.all([fetchReply(personaId, history), sleep(1200)]);
      setTyping((t) => ({ ...t, [personaId]: false }));
      append(personaId, { id: uid(), from: "them", text: reply }, true);
    },
    [matches],
  );

  const markRead = useCallback(
    (personaId: string) =>
      setMatches((ms) => ms.map((m) => (m.personaId === personaId && m.unread ? { ...m, unread: false } : m))),
    [],
  );

  const reset = useCallback(() => {
    setMatches([]);
    setSeen([]);
  }, []);

  return (
    <Ctx.Provider value={{ matches, seen, like, skip, send, markRead, typing, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}

export { getPersona };
