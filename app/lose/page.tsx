"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ResultScreen from "@/components/ResultScreen";
import { getPersona } from "@/lib/personas";

// reason: blocked (texting) | stock (📈 hit 0) | heart (❤️ hit 0) | love (date ended without full ❤️)
function Lose() {
  const params = useSearchParams();
  const who = getPersona(params.get("who") ?? "");
  const name = who ? who.name.toUpperCase() : "THEY";
  const reason = params.get("reason") ?? "blocked";

  const copy: Record<string, [string, string]> = {
    blocked: ["BLOCKED!", `🚫 ${name} BLOCKED YOU · GAME OVER`],
    stock: ["STOCK CRASHED!", "📉 SHAREHOLDERS ARE NOT AMUSED · GAME OVER"],
    heart: ["HEARTBROKEN!", `💔 ${name} LEFT MID-DATE · GAME OVER`],
    love: ["FRIEND-ZONED!", "NOT ENOUGH ❤️ BY THE END · GAME OVER"],
  };
  const [title, subtitle] = copy[reason] ?? copy.blocked;

  return <ResultScreen win={false} title={title} subtitle={subtitle} />;
}

export default function Page() {
  return (
    <Suspense>
      <Lose />
    </Suspense>
  );
}
