# AGENTS.md

Instructions for AI agents working in this repository.

## Project intent

Build a **commercial-style frontend demo** for exploring Hong Kong mortgage scenarios through a spatial (3D) dashboard: connect MetaMask on Sepolia, pick a Hong Kong region, inspect demo market signals, and open a mortgage application flow.

This is a **frontend-first UI prototype and testnet simulation**, not a production lending product. Never add real underwriting, KYC/AML, collateral enforcement, fund transfer, or live market data. All figures and loan outcomes are illustrative. No backend, API keys, or deployed contract are needed to run the demo.

## Roadmap (source of truth: `PLAN.md`)

- **Phase 1 — Cyber HUD Shell & Sepolia Wallet Integration (current):** landing/dashboard split, wallet onboarding, KPI/3D/market/mortgage sections, procedural Hong Kong model. Consider this largely delivered.
- **Phase 2 — Interactive Region Cards & Bank-Grade Mortgage Flow (next):** region intelligence card and a bank-style mortgage application drawer with form fields, repayment calculator, and simulated contract submission. The existing `MarketIntelligenceCard` is static demo data and `MortgageDrawer` is a UI shell only. Keep submission simulated; do not deploy or wire the Solidity contract unless explicitly asked.
- **Phase 3 — Blender MCP 3D Terrain & Architecture Upgrade (LOCKED — DO NOT START):** terrain and landmark modeling, export and replacement of the procedural map. Do not begin Blender work without an explicit unlock from the user.

## Commands

- `npm install`
- `npm run dev` — Vite dev server (Node 20.19+ or 22.12+)
- `npm run build` — emits `dist/` via Vite (does not type-check); a Three.js chunk-size warning is expected and non-blocking
- `npx tsc -b` — type-check; `tsconfig.app.json` enables strict unused locals/parameters, so remove unused imports and props
- `npm run lint` is not configured in `package.json`; do not assume it exists

## Architecture

- `index.html` → `src/main.tsx` is the canonical entry. It mounts `StrictMode → Web3Provider → App` and imports `src/styles/globals.css`.
- `src/app/App.tsx` — `BrowserRouter`, routes `/` (landing), `/dashboard`, unknown → `/`; reads wallet errors via `useWeb3()`.
- `src/app/pages/` — `LandingPage.tsx`, `DashboardPage.tsx` (owns `selectedRegion` and `drawerOpen` state).
- `src/components/dashboard/` — KPI, region control, market intelligence, mortgage action cards.
- `src/components/map/` — R3F canvas, procedural landmass, region meshes, region metadata.
- `src/components/mortgage/MortgageDrawer.tsx` — right-side drawer shell; Phase 2 target.
- `src/components/web3/` — connect-wallet and borrow buttons; borrow enabled only when connected on Sepolia.
- `src/context/Web3Context.tsx` — MetaMask detection, account request, Sepolia validation/switch, balances, `accountsChanged`/`chainChanged` handling, shared error state. `useWeb3()` throws outside `Web3Provider`.
- `constants.ts` at repo root holds Sepolia constants; `src/lib/constants.ts` re-exports them for `src/**` imports.
- `contracts/SpatialMortgage.sol` — testnet-only application registry simulation; **not deployed and not wired to the UI**. Read `docs/CONTRACT_NOTES.md` before integrating.

## Conventions and constraints

- Stack: React 19, TypeScript, Vite 8, Tailwind CSS 4 via `@tailwindcss/vite`, React Router 7 (declarative `BrowserRouter`), React Three Fiber 9 + drei + three, framer-motion, lucide-react, ethers v6. Use Context7 for up-to-date library/API docs rather than guessing.
- Styling: dark glass/aurora theme in `src/styles/globals.css`, which starts with `@import "tailwindcss";`. Reuse existing class names (`glass-card`, `glass-soft`, `section-eyebrow`, `app-bg`, `aurora`) before adding new CSS.
- Region keys are fixed: `hong-kong-island`, `kowloon`, `new-territories` (`src/components/map/regionData.ts`). Keep them consistent across the region control, 3D scene, and market card.
- 3D map stays procedural and lightweight in Phase 1: polygon landmasses and extruded towers, stylized placement, no GIS-accurate boundaries and no Blender assets until Phase 3.
- Wallet errors surface through `ErrorBanner`, not the console. Network target is Sepolia, chain ID `11155111` / `0xaa36a7`.
- Keep the product framing: structured commercial fintech dashboard, not a debug overlay. See `docs/UI_STATES.md`.

## Verification

- After structural changes, run `npx tsc -b` and `npm run build`.
- Smoke-check the dev server with `npm run dev -- --port 5199`, then confirm `/` and `/src/main.tsx` return HTTP 200.
- Wallet errors must surface in `ErrorBanner`, not the console.

## Known traps

- No root-level `main.tsx` exists; `index.html` references `src/main.tsx` only — keep it that way.
- Several empty placeholder files under `src/` are intentionally unused; do not treat them as required exports.
- `useWeb3()` without a `Web3Provider` ancestor white-screens the app; keep the provider in `src/main.tsx`.
- Missing `index.html`, an empty entry file, or undeclared runtime dependencies have caused white screens before. See `.planning/debug/resolved/` and `docs/WHITE_SCREEN_FIX_HANDOFF.md` for past investigations.

## Documentation

- `README.md` — product overview, quick start, tech stack, roadmap, limitations
- `PLAN.md` — phased roadmap and locked phase
- `docs/WEB3.md` — wallet/network contract
- `docs/REGION_DATA.md` — spatial model strategy and region layout
- `docs/UI_STATES.md` — expected wallet and region UI states
- `docs/CONTRACT_NOTES.md` — smart-contract scope and integration checklist
- `docs/WHITE_SCREEN_FIX_HANDOFF.md` — prior white-screen investigation notes
