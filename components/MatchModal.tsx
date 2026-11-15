"use client";

// Kevin's match screen (was match.html), now a popup so app state survives.

import Link from "next/link";
import { useState } from "react";
import type { Persona } from "@/lib/types";
import s from "./MatchModal.module.css";

export default function MatchModal({ persona, onClose }: { persona: Persona; onClose: () => void }) {
  const [bits] = useState(() =>
    Array.from({ length: 42 }, () => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${-Math.random() * 5}s`,
      animationDuration: `${3.5 + Math.random() * 3}s`,
      width: `${7 + Math.random() * 9}px`,
      height: `${12 + Math.random() * 17}px`,
    })),
  );

  return (
    <div className={s.scene}>
      <div className={`${s.bubble} ${s.b1}`} />
      <div className={`${s.bubble} ${s.b2}`} />
      <div className={`${s.bubble} ${s.b3}`} />
      <div className={`${s.bubble} ${s.b4}`} />
      <div className={`${s.star} ${s.s1}`}>★</div>
      <div className={`${s.star} ${s.s2}`}>✦</div>
      <div className={`${s.star} ${s.s3}`}>★</div>
      <div className={`${s.star} ${s.s4}`}>✧</div>

      <div className={s.content}>
        <h1 className={s.title}>
          IT&apos;S A MATCH!
          <span>♥ YOU &amp; {persona.name.toUpperCase()} ♥</span>
        </h1>
        <Link href={`/chat/${persona.id}`} onClick={onClose} className={s.btn}>
          Send a message
        </Link>
        <button onClick={onClose} className={`${s.btn} ${s.ghost}`}>
          Keep swiping
        </button>
      </div>

      <div className={s.confetti}>
        {bits.map((style, i) => (
          <i key={i} style={style} />
        ))}
      </div>
    </div>
  );
}
