"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ChatMessage, Match, Persona, StoryChoice } from "./types";
import { getPersona } from "./personas";

type Store = {
  matches: Match[];
  seen: string[]; // persona ids already swiped
  typing: Record<string, boolean>;
  like: (persona: Persona) => void;
  skip: (persona: Persona) => void;
  choose: (personaId: string, choice: StoryChoice) => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = "jinge-state-v2";
const uid = () => Math.random().toString(36).slice(2, 10);

const TYPING_MS = 1100; // persona "typing…" before each reply bubble

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Persist so an accidental refresh mid-demo doesn't wipe everything
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s) {
        // a refresh mid-typing would strand a chat; resume it at "over"
        setMatches((s.matches ?? []).map((m: Match) => (m.node === null && !m.over ? { ...m, over: true } : m)));
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

  const update = (personaId: string, fn: (m: Match) => Match) =>
    setMatches((ms) => ms.map((m) => (m.personaId === personaId ? fn(m) : m)));

  const later = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  // Swipe right: start a chat at the story's first node (Jensen texts first)
  const like = useCallback((persona: Persona) => {
    setSeen((s) => [...s, persona.id]);
    setMatches((ms) => [
      { personaId: persona.id, messages: [], node: persona.story.start, over: false },
      ...ms.filter((m) => m.personaId !== persona.id),
    ]);
  }, []);

  const skip = useCallback((persona: Persona) => setSeen((s) => [...s, persona.id]), []);

  // Jensen taps a reply: send it, persona types each reply bubble, then next node or end
  const choose = useCallback((personaId: string, choice: StoryChoice) => {
    const msg = (from: ChatMessage["from"], text: string): ChatMessage => ({ id: uid(), from, text });
    update(personaId, (m) => ({ ...m, node: null, messages: [...m.messages, msg("me", choice.me)] }));

    let t = 400;
    choice.them.forEach((text) => {
      later(t, () => setTyping((x) => ({ ...x, [personaId]: true })));
      t += TYPING_MS;
      later(t, () => {
        setTyping((x) => ({ ...x, [personaId]: false }));
        update(personaId, (m) => ({ ...m, messages: [...m.messages, msg("them", text)] }));
      });
      t += 250;
    });

    later(t, () =>
      update(personaId, (m) => ({
        ...m,
        node: choice.next ?? null,
        over: !choice.next,
        blocked: !choice.next && !!choice.blocked,
        location: choice.location,
        messages: choice.end ? [...m.messages, msg("system", choice.end)] : m.messages,
      })),
    );
  }, []);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyping({});
    setMatches([]);
    setSeen([]);
  }, []);

  return (
    <Ctx.Provider value={{ matches, seen, typing, like, skip, choose, reset }}>{children}</Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}

// "Your turn" = chat is waiting on Jensen to pick a reply
export const isYourTurn = (m: Match) => m.node !== null;

export { getPersona };
