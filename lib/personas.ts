import raw from "@/data/personas.json";
import datesRaw from "@/data/dates.json";
import locationsRaw from "@/data/locations.json";
import type { DateSim, Location, Persona } from "./types";

export const personas = raw as unknown as Persona[];
const dates = datesRaw as unknown as Record<string, DateSim>;
export const locations = locationsRaw as Record<string, Location>;

// Catch typos early (shows up as an error overlay in `npm run dev`)
const fail = (msg: string) => {
  throw new Error(`personas.json: ${msg}`);
};
for (const p of personas) {
  const { start, nodes } = p.story ?? {};
  if (!nodes || !nodes[start]) fail(`"${p.id}" story.start "${start}" is not a node`);
  for (const [nodeId, node] of Object.entries(nodes)) {
    for (const c of node.choices) {
      if (c.next && !nodes[c.next]) fail(`"${p.id}" node "${nodeId}" points to missing node "${c.next}"`);
      if (c.location && !locations[c.location]) fail(`"${p.id}" node "${nodeId}" uses unknown location "${c.location}"`);
    }
  }
  for (const r of getDate(p).rounds)
    for (const o of r.options)
      if (o.location && !locations[o.location]) fail(`"${p.id}" date option uses unknown location "${o.location}"`);
}

export function getPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

export function getDate(p: Persona): DateSim {
  return p.date ?? dates.default;
}
