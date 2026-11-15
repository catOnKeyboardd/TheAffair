"use client";

import Link from "next/link";
import type { Persona } from "@/lib/types";

export default function MatchModal({ persona, onClose }: { persona: Persona; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/90 px-6">
      <div className="animate-pop w-full max-w-[360px] text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">It&apos;s a match</p>
        <h2 className="mt-3 font-serif text-5xl leading-tight">
          You &amp; {persona.name}
        </h2>
        <div className="mt-8 flex justify-center -space-x-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-ink bg-stone-700 font-serif text-4xl">J</div>
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-ink bg-accent font-serif text-4xl">
            {persona.name[0]}
          </div>
        </div>
        <Link
          href={`/chat/${persona.id}`}
          onClick={onClose}
          className="mt-10 block rounded-full bg-paper py-3 font-semibold text-ink"
        >
          Send a message
        </Link>
        <button onClick={onClose} className="mt-3 w-full py-2 text-sm text-white/70">
          Keep looking
        </button>
      </div>
    </div>
  );
}
