import raw from "@/data/personas.json";
import type { Persona } from "./types";

export const personas = raw as Persona[];

export function getPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}
