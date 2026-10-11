# H21 — CI after `ubuntu-latest` moves to Ubuntu 26

**Priority P3, date-bound · Claude · uma-rpg and uma-platform · XS.** On or after 2026-10-19.

## Why

GitHub moves `ubuntu-latest` to Ubuntu 26 on 2026-10-19. Both repos' workflows use it: uma-rpg verifies and deploys on
every push to `main`. A runner change can break native installs or the gcloud step without any code change.

## Do

1. **Watch the first uma-rpg deploy after 2026-10-19:**

   ```bash
   gh run list -R luismlorenzana/uma-rpg -L 3
   gh run watch <id> -R luismlorenzana/uma-rpg --exit-status
   ```

   Then check the first uma-platform run.
2. **If a run fails because of the runner:** pin `runs-on: ubuntu-24.04` in that workflow, push, then fix the cause
   (the Node or pnpm setup, apt packages, gcloud) and unpin.
3. **If both pass:** delete this packet and the backlog line.

## Done when

One green verify and deploy run on Ubuntu 26 in each repo.
