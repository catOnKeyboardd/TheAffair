// Shared contract between all three of us. Change only after telling the team.

export type ProfileItem =
  | { id: string; kind: "photo"; src?: string; caption?: string }
  | { id: string; kind: "prompt"; question: string; answer: string };

export type Persona = {
  id: string;
  name: string;
  age: number;
  location: string;
  job: string;
  items: ProfileItem[]; // the vertical Hinge-style scroll: photo, prompt, photo, prompt...
  backstory: string; // Raymond: fed to the LLM as the persona's system prompt
  openingLine: string; // first reply after a match
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  // set on the first message: the profile item Jensen liked
  likedItem?: ProfileItem;
};

export type Match = {
  personaId: string;
  messages: ChatMessage[];
  unread: boolean; // true = "Your turn"
};

// Kevin's component contract
export type LikeHandler = (persona: Persona, item: ProfileItem, comment: string) => void;
export type SkipHandler = (persona: Persona) => void;

// Raymond's API contract: POST /api/chat
export type ChatRequest = { personaId: string; messages: ChatMessage[] };
export type ChatResponse = { reply: string };
