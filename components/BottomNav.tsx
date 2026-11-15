"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isYourTurn, useStore } from "@/lib/store";

export default function BottomNav() {
  const path = usePathname();
  const { matches } = useStore();
  const unread = matches.filter(isYourTurn).length;
  // only the Chats list shows the nav; every other screen is full height
  if (path !== "/matches") return null;

  const tab = (href: string, label: string, active: boolean, badge = 0) => (
    <Link
      href={href}
      className={`relative flex-1 py-3 text-center text-sm font-semibold ${active ? "text-ink" : "text-muted"}`}
    >
      {label}
      {badge > 0 && (
        <span className="absolute top-2 ml-1 rounded-full bg-accent px-1.5 text-[10px] text-white">{badge}</span>
      )}
    </Link>
  );

  return (
    <nav className="flex border-t border-line bg-paper">
      {tab("/", "Swipe", false)}
      {tab("/matches", "Chats", true, unread)}
    </nav>
  );
}
