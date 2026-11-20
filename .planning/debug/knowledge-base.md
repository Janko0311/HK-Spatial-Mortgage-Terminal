# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## dev-server-not-launching — Vite dev server crashed at config load: missing @tailwindcss/vite
- **Date:** 2026-11-20T12:28:25Z
- **Error patterns:** ERR_MODULE_NOT_FOUND, UNRESOLVED_IMPORT, "Could not resolve '@tailwindcss/vite'", "dev server not launch", "failed to load config", Vite config startup crash
- **Root cause(s):** vite.config.ts imports `@tailwindcss/vite` (Tailwind v4 first-party Vite plugin) but the package was never declared/installed; config-load failed before the server could listen.
- **Fix:** `npm install --save-dev @tailwindcss/vite@^4.3.5`; keep `tailwindcss()` in vite.config.ts and `@import "tailwindcss";` in CSS.
- **Files changed:** package.json, package-lock.json
- **Why not caught:** no gate existed for this class — config imports and package.json devDependencies were not cross-checked; `npm run dev` was the first and only detector.
- **Recurrence guard:** CI smoke check that runs `npm run dev` and asserts the "ready" line with no UNRESOLVED_IMPORT; plus a preflight assertion that every bare import in `vite.config.ts` resolves from node_modules. KB pattern: whenever a Vite config registers a plugin, verify the plugin package is in devDependencies.
---

