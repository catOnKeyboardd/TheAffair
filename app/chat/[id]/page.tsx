"use client";

// Chat screen: Kevin's chat.html design, driven by the persona's story (Raymond's flowchart).
// Jensen picks a reply button -> persona types -> next choices, until the story ends.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getPersona, useStore } from "@/lib/store";
import s from "./chat.module.css";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const persona = getPersona(id);
  const router = useRouter();
  const { matches, typing, choose } = useStore();
  const match = matches.find((m) => m.personaId === id);
  const bottom = useRef<HTMLDivElement>(null);

  const count = match?.messages.length ?? 0;
  const isTyping = !!typing[id];
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [count, isTyping, match?.node]);

  // Path finished: 1.5s later -> date sim, or lose page if blocked
  const over = !!match?.over;
  const blockedEnd = !!match?.blocked;
  useEffect(() => {
    if (!over) return;
    const t = setTimeout(
      () => router.push(blockedEnd ? `/lose?reason=blocked&who=${id}` : `/date/${id}`),
      1500,
    );
    return () => clearTimeout(t);
  }, [over, blockedEnd, id, router]);

  if (!persona || !match) {
    return (
      <div className={s.chat}>
        <p style={{ textAlign: "center", marginTop: 40 }}>No chat here.</p>
        <Link href="/" className={`${s.choice} ${s.next}`}>
          Back to swiping
        </Link>
      </div>
    );
  }

  const photo = persona.items.find((i) => i.kind === "photo");
  const node = match.node ? persona.story.nodes[match.node] : null;
  const blocked = !!match.blocked;

  return (
    <div className={s.chat}>
      <div className={s.header}>
        <Link href="/matches" className={s.back} aria-label="Back">
          ‹
        </Link>
        {photo?.kind === "photo" && photo.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={persona.name} className={s.avatar} />
        ) : (
          <div className={s.avatar}>{persona.name[0]}</div>
        )}
        <div className={s.info}>
          <div className={s.name}>{persona.name}</div>
          <div className={s.status}>{isTyping ? "typing…" : blocked ? "🚫 blocked you" : "♥ Matched with you"}</div>
        </div>
        <div className={s.heart}>♥</div>
      </div>

      <div className={s.banner}>♥ IT&apos;S A MATCH! YOU AND {persona.name.toUpperCase()} LIKE EACH OTHER ♥</div>

      <div className={s.messages}>
        <div className={s.divider}>TODAY</div>
        {match.messages.map((m) =>
          m.from === "system" ? (
            <div key={m.id} className={s.system}>
              {m.text}
            </div>
          ) : (
            <div key={m.id} className={`${s.row} ${m.from === "me" ? s.sent : s.received}`}>
              <div className={s.bubble}>{m.text}</div>
              <div className={s.time}>{m.from === "me" ? "You" : persona.name} · Just now</div>
            </div>
          ),
        )}
        {isTyping && (
          <div className={`${s.row} ${s.received}`}>
            <div className={`${s.bubble} ${s.typing}`}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      {node && !isTyping && (
        <div className={s.choices}>
          <div className={s.heading}>✦ HOW DO YOU WANT TO RESPOND? ✦</div>
          {node.choices.map((c) => (
            <button key={c.me} className={s.choice} onClick={() => choose(id, c)}>
              {c.me}
            </button>
          ))}
        </div>
      )}

      {match.over && (
        <div className={s.choices}>
          <div className={s.heading}>{blocked ? "💀 uh oh…" : "✦ HEADING TO THE DATE… ✦"}</div>
        </div>
      )}

      <div className={s.footer}>JINGE ♥ THE AFFAIR</div>
    </div>
  );
}
