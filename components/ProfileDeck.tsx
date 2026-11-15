"use client";

// KEVIN OWNS THIS FILE. Ported from his original index.html.
// Contract: show personas[0]; call onLike(persona) or onSkip(persona).
// Swipe right / ♥ = like, swipe left / × = skip. Tap the photo to see the next one.
// Styles live in ProfileDeck.module.css.

import Link from "next/link";
import { useRef, useState } from "react";
import { isYourTurn, useStore } from "@/lib/store";
import type { LikeHandler, Persona, ProfileItem, SkipHandler } from "@/lib/types";
import s from "./ProfileDeck.module.css";

type Props = { personas: Persona[]; onLike: LikeHandler; onSkip: SkipHandler };
type Photo = Extract<ProfileItem, { kind: "photo" }>;

const SWIPE_PX = 100;

export default function ProfileDeck({ personas, onLike, onSkip }: Props) {
  const persona = personas[0];
  const { matches } = useStore();
  const unread = matches.filter(isYourTurn).length;

  const [photoIdx, setPhotoIdx] = useState(0);
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0); // fly-off direction
  const start = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const topbar = (
    <div className={s.topbar}>
      <div className={s.avatar} aria-hidden>
        🧥
      </div>
      <div className={s.logo}>Jinge</div>
      <Link href="/matches" className={s.chat} aria-label="Matches">
        ●{unread > 0 && <span className={s.badge}>{unread}</span>}
      </Link>
    </div>
  );

  if (!persona) {
    return (
      <div className={s.deck}>
        {topbar}
        <div className={s.empty}>
          That&apos;s everyone.
          <br />
          Even Jensen runs out of options.
        </div>
      </div>
    );
  }

  const photos = persona.items.filter((i): i is Photo => i.kind === "photo");
  const photo = photos[photoIdx % Math.max(photos.length, 1)];

  // Animate the card off screen, then hand off to the parent
  const decide = (dir: 1 | -1) => {
    if (leaving) return;
    setLeaving(dir);
    setTimeout(() => {
      if (dir === 1) onLike(persona);
      else onSkip(persona);
    }, 250);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (leaving) return;
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (start.current) setDx(e.clientX - start.current.x);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    const moveX = e.clientX - start.current.x;
    const moveY = e.clientY - start.current.y;
    start.current = null;
    setDragging(false);
    if (Math.abs(moveX) > SWIPE_PX && Math.abs(moveX) > Math.abs(moveY)) {
      decide(moveX > 0 ? 1 : -1);
    } else {
      setDx(0);
      // A tap (barely moved) cycles photos
      if (Math.abs(moveX) < 6 && Math.abs(moveY) < 6 && photos.length > 1) setPhotoIdx((i) => i + 1);
    }
  };

  const x = leaving ? leaving * 600 : dx;

  return (
    <div className={s.deck}>
      {topbar}

      <div
        className={s.card}
        style={{
          transform: `translateX(${x}px) rotate(${x / 20}deg)`,
          transition: dragging ? "none" : "transform 250ms ease-out",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
          setDragging(false);
          setDx(0);
        }}
      >
        <section className={s.photo}>
          {photo?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.src} alt={persona.name} draggable={false} />
          ) : (
            <div className={s.placeholder}>
              <div>
                {persona.name.toUpperCase()}
                <small>{photo?.caption ?? "photo coming soon"}</small>
              </div>
            </div>
          )}
          {x > 40 && <div className={`${s.stamp} ${s.stampLike}`}>LIKE</div>}
          {x < -40 && <div className={`${s.stamp} ${s.stampNope}`}>NOPE</div>}
          {photos.length > 1 && (
            <div className={s.dots}>
              {photos.map((p, i) => (
                <span key={p.id} className={`${s.dot} ${i === photoIdx % photos.length ? s.dotActive : ""}`} />
              ))}
            </div>
          )}
        </section>

        <section className={s.copy}>
          <h1 className={s.name}>
            {persona.name}
            {persona.age ? `, ${persona.age}` : ""}
          </h1>
          <div className={s.job}>
            💼 {persona.job} · 📍 {persona.location}
          </div>
          {persona.lookingFor && <div className={s.looking}>💘 Looking for: {persona.lookingFor}</div>}
          <p className={s.bio}>{persona.bio}</p>
        </section>
      </div>

      <div className={s.actions}>
        <button className={`${s.action} ${s.no}`} aria-label="Skip" onClick={() => decide(-1)}>
          ×
        </button>
        <button className={`${s.action} ${s.yes}`} aria-label="Like" onClick={() => decide(1)}>
          ♥
        </button>
      </div>
    </div>
  );
}
