# Jinge (by TheAffair)

*Designed to be accelerated.* A dating app from Hensen's POV, simulating his many affairs. Hackathon build, 3 hours.

Storyboard: https://www.figma.com/board/qKXHmYkcJnYtZafF2wz3Pf/Untitled?node-id=0-1&t=DWuBrzE2BFXSDZOm-1

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds a static export (`out/`) and publishes it.
One-time setup: repo Settings → Pages → Source: **GitHub Actions**. Site: `https://<user>.github.io/TheAffair/`.

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

## Date simulation (stage 3)

After a chat path ends: 1.5s later → `/date/<id>`. A blocked ending (`"blocked": true`) → lose page instead.

- Bars: ❤️ and 📈, 5 notches. ❤️ starts at 3, 📈 starts at 2. Each round has 4 options with `heart` / `stock` weights.
- Lose: 📈 drops to 1 or less, ❤️ hits 0, or the last round ends below 4 ❤️. Win: finish with ❤️ >= 4.
- Placeholder rounds: `data/dates.json` → `"default"`. Give a persona its own with a `"date"` key (same shape).
- Backgrounds: `data/locations.json`. The ending choice's `"location"` picks it; an option's `"location"` switches it mid-date.
  Drop `public/bg-<key>.jpg` (e.g. `bg-blackwell.jpg`) and it replaces the gradient automatically.
- Avatars: `public/person1.jpg` … `personN.jpg` (set via `"avatar"` on each persona). Missing image → letter placeholder.

Shared types: `lib/types.ts`.

## Rules

Merge to `main` every 30–45 min. Code freeze 15 min before demo.
