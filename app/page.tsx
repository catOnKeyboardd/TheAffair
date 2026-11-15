"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileDeck from "@/components/ProfileDeck";
import MatchModal from "@/components/MatchModal";
import { personas } from "@/lib/personas";
import { useStore } from "@/lib/store";
import type { Persona } from "@/lib/types";

const CONFETTI_MS = 1500; // match screen flashes, then straight into the chat

export default function Swipe() {
  const router = useRouter();
  const { seen, like, skip } = useStore();
  const [matched, setMatched] = useState<Persona | null>(null);
  // Deck loops forever: rotate the list by how many swipes so far
  const start = seen.length % personas.length;
  const deck = [...personas.slice(start), ...personas.slice(0, start)];

  useEffect(() => {
    if (!matched) return;
    const t = setTimeout(() => router.push(`/chat/${matched.id}`), CONFETTI_MS);
    return () => clearTimeout(t);
  }, [matched, router]);

  return (
    <>
      <ProfileDeck
        key={seen.length} // fresh card state per swipe (same profile can come back around)
        personas={deck}
        onLike={(p) => {
          like(p);
          setMatched(p);
        }}
        onSkip={skip}
      />
      {matched && <MatchModal persona={matched} />}
    </>
  );
}
