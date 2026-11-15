"use client";

// KEVIN OWNS THIS FILE. Working stub so the app flow runs end to end.
// Contract: render one persona at a time; call onLike(persona, item, comment) or onSkip(persona).
// Make it pretty / add swipe gestures / animations as you like, just keep the props.

import { useState } from "react";
import type { LikeHandler, Persona, ProfileItem, SkipHandler } from "@/lib/types";
import ProfileItemCard from "./ProfileItemCard";

type Props = { personas: Persona[]; onLike: LikeHandler; onSkip: SkipHandler };

export default function ProfileDeck({ personas, onLike, onSkip }: Props) {
  const persona = personas[0];
  const [liking, setLiking] = useState<ProfileItem | null>(null);
  const [comment, setComment] = useState("");

  if (!persona) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="font-serif text-3xl">That&apos;s everyone.</p>
        <p className="mt-2 text-muted">Even Jensen runs out of options. Check your matches.</p>
      </div>
    );
  }

  const submitLike = () => {
    if (!liking) return;
    onLike(persona, liking, comment.trim() || "♥");
    setLiking(null);
    setComment("");
  };

  return (
    <div className="relative min-h-full">
      <div className="space-y-3 px-3 pb-28 pt-4">
        <header className="px-2 pb-1">
          <h1 className="font-serif text-4xl">{persona.name}</h1>
          <p className="text-sm text-muted">
            {persona.age} · {persona.job} · {persona.location}
          </p>
        </header>

        {persona.items.map((item) => (
          <div key={item.id} className="relative">
            <ProfileItemCard item={item} persona={persona} />
            <button
              aria-label="Like"
              onClick={() => setLiking(item)}
              className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-2xl text-accent shadow-md active:scale-90"
            >
              ♥
            </button>
          </div>
        ))}
      </div>

      {/* Skip button (Hinge-style X, bottom-left) */}
      <button
        aria-label="Skip"
        onClick={() => onSkip(persona)}
        className="sticky bottom-4 left-4 ml-4 flex h-14 w-14 items-center justify-center rounded-full bg-paper text-2xl text-muted shadow-lg active:scale-90"
      >
        ✕
      </button>

      {/* Like + comment sheet */}
      {liking && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40" onClick={() => setLiking(null)}>
          <div className="w-full max-w-[420px] space-y-3 rounded-t-3xl bg-cream p-4" onClick={(e) => e.stopPropagation()}>
            <ProfileItemCard item={liking} persona={persona} small />
            <input
              autoFocus
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitLike()}
              placeholder="Add a comment"
              className="w-full rounded-full border border-line bg-paper px-4 py-3 outline-none"
            />
            <button onClick={submitLike} className="w-full rounded-full bg-ink py-3 font-semibold text-white">
              Send like
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
