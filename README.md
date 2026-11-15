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

## Contracts

- **ProfileDeck** (Kevin): `<ProfileDeck personas onLike={(persona, item, comment) => …} onSkip={(persona) => …} />`
  Shows `personas[0]`. Liking a photo/prompt + comment = match.
- **Chat API** (Raymond): `POST /api/chat { personaId, messages } -> { reply }`
  Use `persona.backstory` as the system prompt. If the API fails, the app shows a fallback line, so the demo never dies.
- **Add a profile** (anyone): add one entry to `data/personas.json`. Photos go in `public/` (e.g. `"src": "/tess.jpg"`). The first photo is the swipe card photo.
- **Story scripts** (Raymond): `script` on each persona = scripted texts fired on triggers (`match`, `match:<otherPersonaId>` for jealousy, `date:<option>`). See `ScriptEvent` in `lib/types.ts`.
- **Personas** (Raymond): see `Persona` in `lib/types.ts`. `items` is the profile scroll (photos + prompts). Photos without `src` render as a placeholder; drop images in `public/` and set `src: "/name.jpg"`.

## Flow

Discover (scroll profile) → ♥ a prompt + comment → It's a match → Chat → Matches list ("Your turn").
"reset demo" on the Matches page clears everything for rehearsal.

## Rules

Merge to `main` every 30–45 min. Code freeze 15 min before demo.
