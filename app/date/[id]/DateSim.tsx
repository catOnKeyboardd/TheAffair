"use client";

// Stage 3: date simulation.
// ❤️ and 📈 bars, 5 notches each, start at 3. Each round has 4 options with heart/stock weights.
// Lose: 📈 drops to 1 or less, ❤️ hits 0, or the date ends below 4 ❤️. Win: finish with ❤️ >= 4.
// Content lives in data/dates.json ("default") or a persona's "date" in personas.json.

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getDate, getPersona, locations } from "@/lib/personas";
import { useStore } from "@/lib/store";
import type { DateOption } from "@/lib/types";
import s from "./date.module.css";

const MAX = 5;
const START_HEART = 3;
const START_STOCK = 2; // lower than hearts on purpose: harder to win
const WIN_HEART = 4; // finish the date with at least this many hearts
const LOSE_STOCK = 1; // stock at or below this = instant loss
const clamp = (n: number) => Math.max(0, Math.min(MAX, n));
const DEFAULT_LOCATION = "fancy";

function Bar({ icon, value, on, shake }: { icon: string; value: number; on: string; shake: boolean }) {
  return (
    <div className={`${s.bar} ${shake ? s.shake : ""}`}>
      <span className={s.icon}>{icon}</span>
      <div className={s.notches}>
        {Array.from({ length: MAX }, (_, i) => (
          <span key={i} className={`${s.notch} ${i < value ? on : ""}`} />
        ))}
      </div>
    </div>
  );
}

const fmt = (n: number, icon: string) => (n === 0 ? "" : `${n > 0 ? "+" : ""}${n} ${icon}`);

export default function DateSim() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const persona = getPersona(id);
  const { matches } = useStore();
  const match = matches.find((m) => m.personaId === id);

  const [heart, setHeart] = useState(START_HEART);
  const [stock, setStock] = useState(START_STOCK);
  const [round, setRound] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loc, setLoc] = useState<string | null>(null);
  const [delta, setDelta] = useState<{ key: number; text: string } | null>(null);
  const [shake, setShake] = useState<{ heart: boolean; stock: boolean }>({ heart: false, stock: false });
  const [avatarOk, setAvatarOk] = useState(true);
  const [stage, setStage] = useState(() => getPersona(id)?.avatarStart ?? 0); // glow-up look index
  const [sparkle, setSparkle] = useState(0); // bump to replay the sparkle burst
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (!persona) {
    return <div className={s.sim} />;
  }

  const date = getDate(persona);
  const current = date.rounds[round];
  const locKey = loc ?? match?.location ?? DEFAULT_LOCATION;
  const location = locations[locKey] ?? locations[DEFAULT_LOCATION];
  const bg = location.image ? `url(${location.image}), ${location.gradient}` : location.gradient;
  const look = persona.avatarStages?.[stage];
  const avatarSrc = look?.src ?? persona.avatar;

  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  const pick = (o: DateOption) => {
    if (busy) return;
    setBusy(true);
    setPicked(o.text);
    setBubble(null);

    later(600, () => {
      const h = clamp(heart + o.heart);
      const st = clamp(stock + o.stock);
      setHeart(h);
      setStock(st);
      setBubble(o.reply);
      if (o.location) setLoc(o.location);
      const stages = persona.avatarStages;
      if (o.glowUp && stages && stages.length) {
        setStage((n) => Math.min(n + 1, stages.length - 1));
        setSparkle(Date.now());
      }
      const d = [fmt(o.heart, "❤️"), fmt(o.stock, "📈")].filter(Boolean).join("  ");
      if (d) setDelta({ key: Date.now(), text: d });
      setShake({ heart: o.heart < 0, stock: o.stock < 0 });

      const lastRound = round >= date.rounds.length - 1;
      if (st <= LOSE_STOCK) return later(1600, () => router.push(`/lose?reason=stock&who=${id}`));
      if (h <= 0) return later(1600, () => router.push(`/lose?reason=heart&who=${id}`));
      if (lastRound)
        return later(1800, () => router.push(h >= WIN_HEART ? `/win?who=${id}` : `/lose?reason=love&who=${id}`));

      later(1600, () => {
        setRound((r) => r + 1);
        setPicked(null);
        setBubble(null); // clear last reply so the next round's scene line shows
        setShake({ heart: false, stock: false });
        setBusy(false);
      });
    });
  };

  return (
    <div className={s.sim}>
      <div className={s.bg} style={{ background: bg, backgroundSize: "cover", backgroundPosition: "center" }} />

      <div className={s.top}>
        <div className={s.bars}>
          <Bar icon="❤️" value={heart} on={s.heartOn} shake={shake.heart} />
          <Bar icon="📈" value={stock} on={s.stockOn} shake={shake.stock} />
        </div>
        <div className={s.meta}>
          <span className={s.tag}>📍 {location.name.toUpperCase()}</span>
          <span className={s.tag}>
            ROUND {Math.min(round + 1, date.rounds.length)}/{date.rounds.length}
          </span>
        </div>
      </div>

      <div className={s.stage}>
        {bubble ? (
          <div key={bubble} className={s.speech}>
            {bubble}
          </div>
        ) : (
          <div className={s.narration}>
            {picked
              ? "…"
              : (current?.scene ??
                (round === 0 ? `Your date with ${persona.dateName ?? persona.name} begins. Make it count.` : "Your move."))}
          </div>
        )}
        <div className={s.avatarWrap}>
          {avatarSrc && avatarOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={stage} // re-mount so the glow-up animation replays
              src={avatarSrc}
              alt={persona.name}
              className={`${s.avatar} ${sparkle ? s.glow : ""}`}
              style={look?.filter ? { filter: look.filter } : undefined}
              onError={() => setAvatarOk(false)}
            />
          ) : (
            <div className={s.avatar}>{persona.name[0]}</div>
          )}
          {sparkle > 0 && (
            <div key={sparkle} className={s.sparkles} aria-hidden>
              {["✨", "⭐", "✨", "💖", "✨", "⭐", "✨", "💖"].map((c, i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className={s.name}>{persona.dateName ?? persona.name}</div>
      </div>

      {delta && (
        <div key={delta.key} className={s.delta}>
          {delta.text}
        </div>
      )}

      <div className={s.panel}>
        <div className={s.you}>{picked ? `YOU: “${picked}”` : "✦ WHAT DO YOU DO? ✦"}</div>
        <div className={s.options}>
          {current?.options.map((o) => (
            <button key={o.text} className={s.option} onClick={() => pick(o)} disabled={busy}>
              {o.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
