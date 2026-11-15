"use client";

// Win / lose screens, same theme as Kevin's match screen.
// Restart resets ALL game state and goes back to swiping.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import s from "./MatchModal.module.css";

type Props = { win: boolean; title: string; subtitle: string };

export default function ResultScreen({ win, title, subtitle }: Props) {
  const router = useRouter();
  const { reset } = useStore();
  const [bits] = useState(() =>
    Array.from({ length: win ? 42 : 0 }, () => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${-Math.random() * 5}s`,
      animationDuration: `${3.5 + Math.random() * 3}s`,
      width: `${7 + Math.random() * 9}px`,
      height: `${12 + Math.random() * 17}px`,
    })),
  );

  const restart = () => {
    reset();
    router.push("/");
  };

  return (
    <div
      className={s.scene}
      style={win ? undefined : { background: "linear-gradient(145deg, #4a4c57, #30323b)" }}
    >
      <div className={`${s.bubble} ${s.b1}`} style={win ? undefined : { background: "#ff2f61", boxShadow: "none" }} />
      <div className={`${s.bubble} ${s.b2}`} />
      <div className={`${s.bubble} ${s.b3}`} style={win ? undefined : { background: "#ff2f61" }} />
      <div className={`${s.bubble} ${s.b4}`} />
      <div className={`${s.star} ${s.s1}`}>{win ? "★" : "💔"}</div>
      <div className={`${s.star} ${s.s2}`}>{win ? "✦" : "📉"}</div>
      <div className={`${s.star} ${s.s3}`}>{win ? "★" : "💀"}</div>
      <div className={`${s.star} ${s.s4}`}>{win ? "✧" : "✖"}</div>

      <div className={s.content}>
        <h1 className={s.title}>
          {title}
          <span>{subtitle}</span>
        </h1>
        <button onClick={restart} className={s.btn}>
          ↺ Restart
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
