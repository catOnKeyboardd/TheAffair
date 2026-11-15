"use client";

import { useState } from "react";
import ProfileDeck from "@/components/ProfileDeck";
import MatchModal from "@/components/MatchModal";
import { personas } from "@/lib/personas";
import { useStore } from "@/lib/store";
import type { Persona } from "@/lib/types";

export default function Discover() {
  const { seen, like, skip } = useStore();
  const [matched, setMatched] = useState<Persona | null>(null);
  const remaining = personas.filter((p) => !seen.includes(p.id));

  return (
    <>
      <ProfileDeck
        key={remaining[0]?.id ?? "empty"} // fresh state + scroll reset per profile
        personas={remaining}
        onLike={(p, item, comment) => {
          like(p, item, comment);
          setMatched(p); // everyone matches with Jensen. obviously.
        }}
        onSkip={skip}
      />
      {matched && <MatchModal persona={matched} onClose={() => setMatched(null)} />}
    </>
  );
}
