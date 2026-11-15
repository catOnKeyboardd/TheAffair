import { personas } from "@/lib/personas";
import DateSim from "./DateSim";

export const dynamicParams = false;

export function generateStaticParams() {
  return personas.map((p) => ({ id: p.id }));
}

export default function Page() {
  return <DateSim />;
}
