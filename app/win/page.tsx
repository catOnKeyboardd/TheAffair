"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ResultScreen from "@/components/ResultScreen";
import { getPersona } from "@/lib/personas";

function Win() {
  const who = getPersona(useSearchParams().get("who") ?? "");
  return (
    <ResultScreen
      win
      title="YOU WIN!"
      subtitle={`♥ ${who ? who.name.toUpperCase() : "THEY"} FELL FOR YOU · STOCK STILL UP 📈`}
    />
  );
}

export default function Page() {
  return (
    <Suspense>
      <Win />
    </Suspense>
  );
}
