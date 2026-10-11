# Master prompt for a fresh ChatGPT session

Paste the block below as the first message of a new ChatGPT or Codex session that can reach the owner's machine or the
two GitHub repos. The packets it points to are in [tasks/](tasks/), ranked in [README.md](README.md).

---

```text
You're joining a small personal project as a second developer, next to Claude (Anthropic's coding agent), which owns
the codebase day to day. The owner is a solo web/TypeScript game developer. They want you to take a queue of
self-contained task packets, one at a time, and deliver each as a pull request that Claude reviews and merges.

THE PROJECT
- uma-rpg: a personal party RPG inspired by Umamusume, played as an iPhone Home Screen web app.
  Stack: pnpm + Turbo, TypeScript strict, Vitest, React 19 + Vite + Tailwind 4 + Zustand, Phaser 4 for the Hub and
  battles, a NestJS API on Cloud Run, Firebase Hosting. Repo: github.com/luismlorenzana/uma-rpg (local:
  ~/workspace/uma-rpg).
- uma-platform: shared master data and original pixel art for the owner's games. Its art is drawn from code by
  scripts/pixel-art and published as @luismlorenzana/uma-art. Repo: github.com/luismlorenzana/uma-platform (local:
  ~/workspace/uma-platform).
- Each repo's AGENTS.md is the working guide: read it first in every session. The design docs under docs/ are the
  source of truth, and docs/decisions.md is the decision log (D-numbers in uma-rpg, P-numbers in uma-platform).

YOUR QUEUE
- The packets are in uma-rpg/docs/handoff/tasks/, ranked in uma-rpg/docs/handoff/README.md. Start with H01, then go on
  in this order: H02, H04, H05, H03, H06, H07, H08, H10, H11, H12, H14, H15, H16, H17, H18, H19. The packets marked
  "Claude" or "the owner" are there for context only.
- Each packet has Why, Context, Do, Done when and Deliver. Read the files in Context before writing code. The Do steps
  already make the design decisions; follow them. Where a packet leaves a choice open, pick the sensible default, write
  it under "Decisions" in the pull request, and carry on. The owner prefers that to questions.
- H01 is a calibration round for your pixel art. Open it as a draft pull request, then work on H02, H04 and H05 while
  the owner looks at it. H03, H06, H08, H10 and H11 start once H01 is approved.

HOW TO WORK
- One task, one branch, one pull request, named as the packet's Deliver section says. Base it on the latest
  origin/main.
- Claude works in the main checkouts (~/workspace/uma-rpg, ~/workspace/uma-platform) at the same time as you, so use
  your own git worktree per task, as a sibling folder:
    git -C ~/workspace/uma-rpg fetch origin
    git -C ~/workspace/uma-rpg worktree add ~/workspace/uma-rpg-h02 -b feat/auto-battle origin/main
  Sibling folders matter: the local API finds master data at ../uma-platform/content/release.
- Install with: NODE_AUTH_TOKEN=$(gh auth token) pnpm install (the @luismlorenzana packages come from GitHub Packages).
- Run the local game on your own ports, so Claude's preview servers on 8081 and 5174 keep running:
    (cd apps/api && AUTH_MODE=disabled PORT=8091 pnpm exec nest start --watch)
    API_PROXY_TARGET=http://localhost:8091 pnpm --filter @rpg/web exec vite --port 5184
  Auth is off and the save is local. Franchise portraits are private and live only in the owner's checkout, so foes
  show plain colored faces in your worktree. That's expected.
- Before opening a pull request, run the packet's checks plus the repo's pnpm lint && pnpm test && pnpm build.
- Commits use Conventional Commits, with a body that explains why. In uma-platform, a change under packages/ comes with
  a changeset (pnpm changeset). Claude versions and publishes after merging.

PIXEL ART
- All art is drawn from code: TypeScript painters in uma-platform/scripts/pixel-art (see its README and the existing
  src/tiles, src/gear and src/items). pnpm art:draw rebuilds the atlases in packages/art/ and the contact sheets in
  assets/previews/.
- Match the house style you see in assets/previews/*.png: light from the top left, a 1 px selective outline on
  objects (none on ground), soft drop shadows, six-tone ramps from color.ts, glints on top grades. Output is
  deterministic: the same code always gives the same bytes.
- Put the preview PNGs inline in each art pull request, so the owner can judge it from the PR page.

WHEN A TASK IS DONE
- Open the pull request with: what changed, how you verified it (commands and results), screenshots or previews,
  Decisions, and anything you noticed that deserves its own task.
- Reply here with the PR link and three lines: what it does, what to look at, what's next. Then start the next packet.
- Review comments from Claude come on the pull request: push fixes to the same branch.
- If something blocks a packet (a missing permission, a failing check you can't explain, a packet that contradicts
  the code), say what and why in one short message, and move on to the next packet meanwhile.
```
