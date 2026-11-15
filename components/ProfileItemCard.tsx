import type { Persona, ProfileItem } from "@/lib/types";

// Shared by the profile deck (Kevin) and the chat's "liked your..." bubble (Hazel)
const gradients = [
  "from-emerald-300 to-lime-500",
  "from-stone-300 to-stone-500",
  "from-amber-200 to-rose-300",
  "from-sky-200 to-indigo-300",
];

export function Photo({ item, persona, small = false }: { item: Extract<ProfileItem, { kind: "photo" }>; persona: Persona; small?: boolean }) {
  const idx = persona.items.indexOf(item);
  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${small ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.src} alt={item.caption ?? persona.name} className="h-full w-full object-cover" />
      ) : (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[Math.max(idx, 0) % gradients.length]}`}>
          <span className="font-serif text-6xl text-white/80">{persona.name[0]}</span>
        </div>
      )}
      {item.caption && (
        <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-xs text-white">{item.caption}</span>
      )}
    </div>
  );
}

export function Prompt({ item, small = false }: { item: Extract<ProfileItem, { kind: "prompt" }>; small?: boolean }) {
  return (
    <div className={`rounded-xl bg-paper ${small ? "p-4" : "px-6 py-10"}`}>
      <p className="text-sm font-semibold text-ink">{item.question}</p>
      <p className={`mt-2 font-serif leading-tight text-ink ${small ? "text-xl" : "text-3xl"}`}>{item.answer}</p>
    </div>
  );
}

export default function ProfileItemCard({ item, persona, small }: { item: ProfileItem; persona: Persona; small?: boolean }) {
  return item.kind === "photo" ? <Photo item={item} persona={persona} small={small} /> : <Prompt item={item} small={small} />;
}
