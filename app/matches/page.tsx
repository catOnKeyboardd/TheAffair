"use client";

import Link from "next/link";
import { getPersona, isYourTurn, useStore } from "@/lib/store";

export default function Chats() {
  const { matches, typing, reset } = useStore();

  return (
    <div className="px-4 pt-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-4xl font-black tracking-tight">Your affairs</h1>
        {/* tiny reset for rehearsing the demo */}
        <button onClick={reset} className="text-xs text-muted underline">
          reset demo
        </button>
      </div>

      {matches.length === 0 && <p className="mt-10 text-center text-muted">No affairs yet. Go swipe.</p>}

      <ul className="mt-4 divide-y divide-line">
        {matches.map((m) => {
          const p = getPersona(m.personaId);
          if (!p) return null;
          const last = m.messages[m.messages.length - 1];
          const photo = p.items.find((i) => i.kind === "photo");
          return (
            <li key={m.personaId}>
              <Link href={`/chat/${p.id}`} className="flex items-center gap-3 py-4">
                {photo?.kind === "photo" && photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.src} alt={p.name} className="h-14 w-14 shrink-0 rounded-full border-[3px] border-ink object-cover" />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-[#7de5e9] text-2xl font-black">
                    {p.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{p.name}</span>
                    {isYourTurn(m) && (
                      <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">Your turn</span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted">
                    {typing[p.id] ? "typing…" : (last?.text ?? "Say something first 👀")}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
