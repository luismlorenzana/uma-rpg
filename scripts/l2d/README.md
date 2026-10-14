# Local L2D reviewer

Downloads NIKKE's animated character models from nikke-db's viewer, plays them for you to sort into enemy roles,
and renders the authoring formats from them. Everything stays in the gitignored `content/l2d/`. The design and the
format options are in [docs/design/l2d-enemies.md](../../docs/design/l2d-enemies.md).

## Download

```sh
pnpm l2d:download
```

About 3 GB for the default groups: 436 entries, the base characters, their outfits, bosses and story characters.
One request a second, so about an hour and a half. Faces and Standing poses come first. Run it again to resume or to
retry failures. `--only <id,id>`, `--poses fb` and `--groups base,skin,boss,story,collab` narrow it. Progress is in
`content/l2d/download.log` when it runs in the background.

## Review

```sh
pnpm l2d:review
```

Open http://127.0.0.1:5195. Each character plays live; switch poses with the buttons or **S** (Standing), **A** (Aim,
from behind) and **C** (Cover, facing you).

| Key | Role |
|---|---|
| 1 | Exclude |
| 2 | Regular |
| 3 | Key enemy |
| 4 | Sub-boss |
| 5 | Boss |

A vote saves at once and moves on. **←/→** go back and skip, and **Z** undoes. The page lists only what has finished
downloading and picks up more every minute.

Votes go to `content/l2d/tiers.json`, with every change appended to `tiers-history.jsonl`.

## Render

- **Render this one** draws every format for the character on screen, including the comparison images: GIF,
  high-quality animation, and Standing + Aim.
- **Render all with a role** goes through every voted unit except Excluded ones, one at a time:
  - stills (2:3 vertical and 16:9 splash) for every role;
  - looping animated versions for Sub-bosses and Bosses.

  Press it again to stop; it resumes where it left off. Keep the tab open; it can sit in the background.

`L2D_CONTENT_DIR` and `L2D_PORT` override the folder and port. The server only answers on 127.0.0.1.
