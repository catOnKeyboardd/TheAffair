import { personas } from "@/lib/personas";
import Chat from "./Chat";

export const dynamicParams = false;

export function generateStaticParams() {
  return personas.map((p) => ({ id: p.id }));
}

export default function Page() {
  return <Chat />;
}
