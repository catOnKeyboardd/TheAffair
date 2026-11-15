# Jinge (by TheAffair)

*Designed to be accelerated.* A dating app from Jensen's POV, simulating his many affairs. Hackathon build, 3 hours.

Storyboard: https://www.figma.com/board/qKXHmYkcJnYtZafF2wz3Pf/Untitled?node-id=0-1&t=DWuBrzE2BFXSDZOm-1

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

## Who owns what (stay in your files = no merge conflicts)

| Who     | Branch                  | Files                                              |
|---------|-------------------------|----------------------------------------------------|
| Hazel   | `hazel/app-shell`       | `app/` pages, `components/` (except ProfileDeck), styles |
| Kevin   | `kevin/profile-deck`    | `components/ProfileDeck.tsx` + `.module.css`, `components/MatchModal.*` |
| Raymond | `raymond/personas-chat` | `data/personas.json`, `app/api/chat/route.ts`      |

Shared contract lives in `lib/types.ts`. Don't change it without telling the group.

## Flow

Swipe RIGHT → confetti (1.5s) → chat. Swipe LEFT → next profile.
In the chat Jensen texts first by tapping a reply button; the persona types back; repeat until the story ends.
"Your affairs" (● button / Chats tab) lists every chat. "reset demo" there clears everything for rehearsal.

## Add or edit a story (no code needed)

Everything lives in `data/personas.json`. Each persona has a `story`, matching Raymond's Figma flowcharts:

```json
"story": {
  "start": "open",
  "nodes": {
    "open": { "choices": [
      { "me": "Heyyy I'm coming to Taiwan soon wyd?", "them": ["You hopefully ;)"], "next": "thursday" },
      { "me": "Ni hao fine shit", "them": ["???"], "end": "🚫 Alice blocked you" }
    ]},
    "thursday": { "choices": [
      { "me": "Ok bet how about next Thursday?", "them": ["Sounds good <3"] }
    ]}
  }
}
```

- blue box = `me` (a button Jensen taps), diamond = `them` (one or more reply bubbles)
- `next` = id of the next node. Leave it out and the chat ends there.
- `end` = optional system line when the chat ends (e.g. blocked)
- Photos: put the image in `public/` and set `"src": "/alice.jpg"` on the photo item.

Shared types: `lib/types.ts`.

## Rules

Merge to `main` every 30–45 min. Code freeze 15 min before demo.
