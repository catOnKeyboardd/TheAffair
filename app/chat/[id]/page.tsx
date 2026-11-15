"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProfileItemCard from "@/components/ProfileItemCard";
import { getPersona, useStore } from "@/lib/store";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const persona = getPersona(id);
  const { matches, typing, send, markRead } = useStore();
  const match = matches.find((m) => m.personaId === id);
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  const count = match?.messages.length ?? 0;
  useEffect(() => {
    markRead(id);
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [id, count, typing[id], markRead]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!persona || !match) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted">No chat here.</p>
        <Link href="/matches" className="underline">Back to matches</Link>
      </div>
    );
  }

  const submit = () => {
    const t = text.trim();
    if (!t || typing[id]) return;
    setText("");
    send(id, t);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-line bg-paper px-4 py-3">
        <Link href="/matches" className="text-2xl text-muted">‹</Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-serif text-white">{persona.name[0]}</div>
        <span className="font-semibold">{persona.name}</span>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {match.messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}>
            {m.likedItem && (
              <div className="mb-1 w-3/4 opacity-90">
                <p className="mb-1 text-right text-xs text-muted">You liked their {m.likedItem.kind}</p>
                <ProfileItemCard item={m.likedItem} persona={persona} small />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                m.from === "me" ? "rounded-br-sm bg-ink text-white" : "rounded-bl-sm bg-paper text-ink"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing[id] && (
          <div className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-paper px-4 py-3">
            <span className="dot h-2 w-2 rounded-full bg-muted" />
            <span className="dot h-2 w-2 rounded-full bg-muted" />
            <span className="dot h-2 w-2 rounded-full bg-muted" />
          </div>
        )}
        <div ref={bottom} />
      </div>

      <div className="flex gap-2 border-t border-line bg-paper p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Send a message"
          className="flex-1 rounded-full border border-line bg-cream px-4 py-2 outline-none"
        />
        <button onClick={submit} className="rounded-full bg-ink px-4 font-semibold text-white disabled:opacity-40" disabled={!text.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
