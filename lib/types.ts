// Shared contract between all three of us. Change only after telling the team.

export type ProfileItem =
  | { id: string; kind: "photo"; src?: string; caption?: string }
  | { id: string; kind: "prompt"; question: string; answer: string };

// ---- Stage 2: texting story (Raymond's Figma flowcharts) ----
// Blue box  = a choice Jensen can send ("me")
// Diamond   = the persona's reply ("them")
// Then either go to the next set of choices ("next") or the chat ends.
export type StoryChoice = {
  me: string; // what Jensen sends (button text)
  them: string[]; // persona's reply bubble(s)
  next?: string; // id of the next node; leave out to end the chat
  end?: string; // optional system line at the end, e.g. "🚫 Alice blocked you"
  blocked?: boolean; // true = this ending loses the game (blocked page)
  location?: string; // ending only: where the date happens (key in data/locations.json)
};
export type StoryNode = { choices: StoryChoice[] };
export type Story = { start: string; nodes: Record<string, StoryNode> };

// ---- Stage 3: date simulation ----
export type DateOption = {
  text: string; // button text
  heart: number; // notches gained/lost on the ❤️ bar (e.g. 1, -1, 0)
  stock: number; // notches gained/lost on the 📈 bar
  reply: string; // character's speech bubble after this pick
  location?: string; // optional: switch the background (key in data/locations.json)
  glowUp?: boolean; // advance the persona to the next avatarStages look, with sparkles
};
export type DateRound = {
  scene?: string; // situation line shown at the start of the round, e.g. "🚪 Someone knocks…"
  options: DateOption[]; // 4 options each
};
export type DateSim = { intro?: string; rounds: DateRound[] };

export type Persona = {
  id: string;
  name: string;
  age?: number;
  location: string;
  job: string;
  bio: string; // shown on the swipe card
  lookingFor?: string; // "Looking for: ..." chip on the swipe card
  avatar?: string; // date sim portrait, e.g. "/person1.jpg"
  // Optional glow-up looks for the date sim (worst -> best). glowUp options move up one stage.
  // filter is a CSS filter for placeholder looks; drop it once a real image is in place.
  avatarStages?: { src: string; filter?: string }[];
  avatarStart?: number; // which stage the date starts on (default 0)
  items: ProfileItem[]; // photos (+ optional prompts). First photo = card photo
  story: Story;
  date?: DateSim; // falls back to data/dates.json "default"
  noDate?: boolean; // true = no date sim; chat ends -> back to the swipe page
  backstory?: string; // only needed if we hook up an LLM later
};

export type Location = { name: string; image?: string; gradient: string };

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
  blocked?: boolean; // ended on a blocked branch
  location?: string; // date location picked by the ending
};

// Swipe deck contract
export type LikeHandler = (persona: Persona) => void;
export type SkipHandler = (persona: Persona) => void;

// Optional LLM API contract: POST /api/chat (not used by the scripted demo)
export type ChatRequest = { personaId: string; messages: ChatMessage[] };
export type ChatResponse = { reply: string };
