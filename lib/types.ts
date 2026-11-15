// Shared contract between all three of us. Change only after telling the team.

export type ProfileItem =
  | { id: string; kind: "photo"; src?: string; caption?: string }
  | { id: string; kind: "prompt"; question: string; answer: string };

// A date invite card shown in chat, with tap-to-reply buttons
export type DateInvite = { title: string; detail?: string; options: string[] };

// Raymond's story scripts. A persona fires these messages when a trigger happens.
// after: "match"                 -> right after Jensen matches this persona
//        "match:<personaId>"     -> when Jensen matches SOMEONE ELSE (jealousy)
//        "date:<option>"         -> when Jensen taps that option on this persona's date card
export type ScriptEvent = {
  after: string;
  delayMs: number;
  text?: string;
  date?: DateInvite;
};

export type Persona = {
  id: string;
  name: string;
  age: number;
  location: string;
  job: string;
  bio: string; // shown on the swipe card
  items: ProfileItem[]; // photos + Hinge-style prompts. First photo = card photo
  backstory: string; // Raymond: fed to the LLM as the persona's system prompt
  openingLine: string; // first text after a match
  matchDelayMs?: number; // how long Jensen waits in "pending" before the match (the joke)
  pendingLabel?: string; // e.g. "estimated lead time: 18 weeks"
  script?: ScriptEvent[];
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  likedItem?: ProfileItem; // set on the first message: the thing Jensen liked
  date?: DateInvite; // set when this message is a date invite card
};

export type Match = {
  personaId: string;
  messages: ChatMessage[];
  unread: boolean; // true = "Your turn"
  status?: "pending" | "matched";
};

// Swipe deck contract
export type LikeHandler = (persona: Persona, item: ProfileItem, comment: string) => void;
export type SkipHandler = (persona: Persona) => void;

// Chat API contract: POST /api/chat
export type ChatRequest = { personaId: string; messages: ChatMessage[] };
export type ChatResponse = { reply: string };
