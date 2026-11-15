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
  const remaining = personas.filter((p) => !seen.includes(p.id));

  useEffect(() => {
    if (!matched) return;
    const t = setTimeout(() => router.push(`/chat/${matched.id}`), CONFETTI_MS);
    return () => clearTimeout(t);
  }, [matched, router]);

  return (
    <>
      <ProfileDeck
        key={remaining[0]?.id ?? "empty"} // fresh state per profile
        personas={remaining}
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
