// Shared contract between all three of us. Change only after telling the team.

export type ProfileItem =
  | { id: string; kind: "photo"; src?: string; caption?: string }
  | { id: string; kind: "prompt"; question: string; answer: string };

// ---- Story (Raymond's Figma flowcharts) ----
// Blue box  = a choice Jensen can send ("me")
// Diamond   = the persona's reply ("them")
// Then either go to the next set of choices ("next") or the chat ends.
export type StoryChoice = {
  me: string; // what Jensen sends (button text)
  them: string[]; // persona's reply bubble(s)
  next?: string; // id of the next node; leave out to end the chat
  end?: string; // optional system line at the end, e.g. "🚫 Alice blocked you"
};
export type StoryNode = { choices: StoryChoice[] };
export type Story = { start: string; nodes: Record<string, StoryNode> };

export type Persona = {
  id: string;
  name: string;
  age?: number;
  location: string;
  job: string;
  bio: string; // shown on the swipe card
  items: ProfileItem[]; // photos (+ optional prompts). First photo = card photo
  story: Story;
  backstory?: string; // only needed if we hook up an LLM later
};

export type ChatMessage = {
  id: string;
  from: "me" | "them" | "system";
  text: string;
};

export type Match = {
  personaId: string;
  messages: ChatMessage[];
  node: string | null; // current story node; null = persona typing or chat over
  over: boolean;
};

// Swipe deck contract
export type LikeHandler = (persona: Persona) => void;
export type SkipHandler = (persona: Persona) => void;

// Optional LLM API contract: POST /api/chat (not used by the scripted demo)
export type ChatRequest = { personaId: string; messages: ChatMessage[] };
export type ChatResponse = { reply: string };
