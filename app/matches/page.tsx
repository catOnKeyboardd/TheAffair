"use client";

import Link from "next/link";
import { getPersona, useStore } from "@/lib/store";

export default function Matches() {
  const { matches, typing, reset } = useStore();

  return (
    <div className="px-4 pt-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-4xl">Matches</h1>
        {/* tiny reset for rehearsing the demo */}
        <button onClick={reset} className="text-xs text-muted underline">reset demo</button>
      </div>

      {matches.length === 0 && <p className="mt-10 text-center text-muted">No matches yet. Go like something.</p>}

      <ul className="mt-4 divide-y divide-line">
        {matches.map((m) => {
          const p = getPersona(m.personaId);
          if (!p) return null;
          const last = m.messages[m.messages.length - 1];
          return (
            <li key={m.personaId}>
              <Link href={`/chat/${p.id}`} className="flex items-center gap-3 py-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-2xl text-white">
                  {p.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{p.name}</span>
                    {m.unread && (
                      <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">Your turn</span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted">{typing[p.id] ? "typing…" : last?.text}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
