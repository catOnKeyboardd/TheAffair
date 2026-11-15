import raw from "@/data/personas.json";
import type { Persona } from "./types";

export const personas = raw as unknown as Persona[];

// Catch story typos early (shows up as an error overlay in `npm run dev`)
for (const p of personas) {
  const { start, nodes } = p.story ?? {};
  if (!nodes || !nodes[start]) throw new Error(`personas.json: "${p.id}" story.start "${start}" is not a node`);
  for (const [nodeId, node] of Object.entries(nodes)) {
    for (const c of node.choices) {
      if (c.next && !nodes[c.next])
        throw new Error(`personas.json: "${p.id}" node "${nodeId}" points to missing node "${c.next}"`);
    }
  }
}

export function getPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}
