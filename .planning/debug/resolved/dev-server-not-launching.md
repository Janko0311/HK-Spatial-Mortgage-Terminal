---
status: resolved
trigger: "The web page fails to load after starting the dev server (describe symptom: blank screen / connection refused / 500 error). Use context7 first to verify the latest configuration and routing rules for our framework version before making changes."
created: 2026-11-20T12:24:47Z
updated: 2026-11-20T12:28:25Z
---

## Current Focus
<!-- OVERWRITE on each update - always reflects NOW -->

hypothesis: RESOLVED — vite.config.ts imports `@tailwindcss/vite`, which is not installed; ERR_MODULE_NOT_FOUND aborts config load so the dev server never starts.
test: `npm run dev` reproduced `Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@tailwindcss/vite'` from the bundled vite.config.ts. After `npm install -D @tailwindcss/vite@^4.3.5`, `npm run dev` prints `VITE v8.3.8 ready in 745 ms`.
expecting: dev server boots with no unresolved-import error; module requests transform and return 200.
next_action: none — terminal, fix verified.
bug_class: missing dependency / config-load failure
reasoning_checkpoint: complete
tdd_checkpoint: none (tdd_mode false)

## Session Loop
<!-- Read and written only by the checkpoint loop that drives gsd-debugger -->

goal: find_and_fix
tdd_mode: false
tdd_phase: none
resume_count: 0
awaiting: none
question: none
last_next_action: gather initial evidence

## Symptoms
<!-- Written during gathering, then immutable -->

expected: Specific route renders
actual: server not even launch, i am not sure whether there is missing module or what
errors: Dev-server terminal
reproduction: npm run dev + open localhost
started: After a code change

## Context7 Verification (orchestrator, before any changes)

Framework versions: Vite ^8.3.8, React ^19.3.1, react-router-dom ^7.18.6, @vitejs/plugin-react ^6.3.0, tailwindcss ^4.3.5.

- Vite 8 (`/vitejs/vite/v8.3.5`): `appType` defaults to `'spa'`, which includes HTML middlewares and SPA history fallback; `index.html` at project root is the module-graph entry point. `server.middlewareMode` disables default HTML handling; with `appType: 'custom'` HTML/404 must be handled manually.
- React Router v7 (`/remix-run/react-router`): use `createBrowserRouter(routes)` once outside the React tree and render `<RouterProvider router={router} />`; in v7 `RouterProvider` is imported from `react-router/dom`. Index routes (`{ index: true }`) render at the parent URL; nested children need `<Outlet />`.

Note: `vite.config.ts` imports `tailwindcss` from `@tailwindcss/vite`, but `package.json` devDependencies do not list `@tailwindcss/vite` (only `tailwindcss`, `postcss`, `autoprefixer`). Treat as a candidate hypothesis to verify, not a confirmed root cause.

Additional Context7 verification (debugger, `/tailwindlabs/tailwindcss.com`, before fix):
- Tailwind CSS v4 documents `@tailwindcss/vite` as the first-party Vite plugin; install with `npm install tailwindcss @tailwindcss/vite`, register `tailwindcss()` in `vite.config.ts`, and `@import "tailwindcss";` in the main CSS. This matches the existing `vite.config.ts` and `src/styles/globals.css` exactly, confirming the fix direction.

## Eliminated
<!-- APPEND only - prevents re-investigating after /clear -->

- Vite config mode: `vite.config.ts` does not set `appType: 'custom'` or `server.middlewareMode`; default SPA mode applies. Not the cause of the startup crash.
- React Router v7 API shape: `src/app/App.tsx` uses declarative `<BrowserRouter>`/`<Routes>`, which v7 still supports; routing is not evaluated until the server boots, so it cannot cause `ERR_MODULE_NOT_FOUND` at config load.
- tailwindcss package itself: `tailwindcss@4.3.5` is installed and resolves; only the separate `@tailwindcss/vite` plugin was absent.

## Evidence
<!-- APPEND only - facts discovered during investigation -->

- 2026-11-20T12:25:10Z — reproduced with `npm run dev`: `vite.config.ts (3:24) [UNRESOLVED_IMPORT] Could not resolve '@tailwindcss/vite'`; then `error when starting dev server: Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@tailwindcss/vite' imported from .../node_modules/.vite-temp/vite.config.ts.timestamp-*.mjs`. Server process exits; no listen socket. Confirms the reported "server not even launch".
- 2026-11-20T12:26:02Z — `vite.config.ts` lines 1-9 register `react()` and `tailwindcss()`; `package.json` devDependencies omit `@tailwindcss/vite`; `node_modules/@tailwindcss/vite` absent; `package-lock.json` contains no `@tailwindcss` entry. `src/styles/globals.css` line 1 is `@import "tailwindcss";` (v4 syntax).
- 2026-11-20T12:27:15Z — fix applied: `npm install --save-dev '@tailwindcss/vite@^4.3.5'` → `added 22 packages`, 0 vulnerabilities.
- 2026-11-20T12:27:40Z — verification: `npm run dev -- --port 5199` → `VITE v8.3.8 ready in 745 ms`, Local http://localhost:5199/, no unresolved-import or config-load error. `curl http://localhost:5199/src/app/App.tsx` → HTTP 200 (Vite transform pipeline healthy).
- 2026-11-20T12:28:00Z — separate pre-existing gaps observed (NOT the reported regression, out of scope): no `index.html` at project root (`curl /` and `/dashboard` → HTTP 404; `npm run build` → `[UNRESOLVED_ENTRY] Cannot resolve entry module index.html`), no `src/main.tsx` React bootstrap, and undeclared runtime deps `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `ethers` imported by components. These are structural incompleteness documented in `docs/WHITE_SCREEN_FIX_HANDOFF.md` for a different snapshot; they cannot cause a config-load crash and require a separate fix session to reach "specific route renders".

## Specialist Review

No matching specialist skill is installed for this runtime (no `typescript-expert` / `engineering:debug` skill available), so no external specialist review was dispatched. The fix direction was verified against Context7 (`/tailwindlabs/tailwindcss.com`): installing the first-party Vite plugin is the documented, idiomatic Tailwind v4 setup, and PostCSS was a rejected alternative because no `postcss.config` exists and `@tailwindcss/postcss` is likewise undeclared.

## Resolution

root_cause: Vite failed to load `vite.config.ts` because it imports `@tailwindcss/vite`, which was never added to the project (missing from devDependencies, package-lock, and node_modules); the resulting ERR_MODULE_NOT_FOUND aborted startup before the server could listen.
fix: Installed the missing first-party Tailwind v4 plugin as a devDependency (`npm install --save-dev @tailwindcss/vite@^4.3.5`), keeping the existing `tailwindcss()` plugin registration and `@import "tailwindcss";` CSS unchanged.
verification: `npm run dev` now boots cleanly (`VITE v8.3.8 ready`, no unresolved-import error) and `/src/app/App.tsx` transforms with HTTP 200. Note: HTTP `/` and `/dashboard` still 404 because `index.html`/entry bootstrap are absent — a separate, pre-existing issue outside this session's reported "server not launching" regression.
oracle_type: direct-reproduction + config-diff + package-resolution check (npm run dev error vs. installed modules)
files_changed:
  - package.json
  - package-lock.json
