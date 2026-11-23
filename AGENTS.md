# AGENTS.md

Engineering rules and architecture map for AI agents working in this repo.

## Scope & Guardrails

- **Frontend-only testnet demo**: Commercial-style Hong Kong spatial (3D) mortgage dashboard. No backend server and no API keys/env secrets. The only chain interaction is browser-signed Sepolia demo calls. All financial figures, AI risk scores, and loan outcomes are simulated.
- **Current Focus (`PLAN.md` Phase 2)**: Upgrade `MarketIntelligenceCard` with dynamic regional analytics/pros & cons. `MortgageDrawer` now has interactive inputs (free-input loan amount, optional property value/LTV, monthly income, tenor), real-time repayment/DSR calculations, and an on-chain Sepolia submission receipt.
- **Locked Boundaries**:
  - **Phase 3 (Blender MCP)**: LOCKED. Keep the 3D map procedural (`Three.js` / `R3F`). Do not invoke Blender or generate `.glb` assets unless explicitly unlocked.
  - **Smart Contract (UNLOCKED by user in Phase 2)**: `contracts/SpatialMortgage.sol` is deployed from the browser at `/deploy` via MetaMask, with no private key in the repo. Do not introduce Hardhat/Foundry or env secrets. See `docs/CONTRACT_NOTES.md`.

## Commands

- `npm run dev` — Start Vite dev server (Node 20.19+ or 22.12+)
- `npx tsc -b` — Strict type-check (`tsconfig.app.json` fails on unused locals/parameters)
- `npm run build` — Production bundle to `dist/` (runs Vite build only; **does not type-check**; Three.js chunk warning is expected)
- *Note*: `npm run lint` is not configured; do not run it.

## Architecture Map

- `index.html` → `src/main.tsx` — Canonical entry (`StrictMode` → `Web3Provider` → `App` + `src/styles/globals.css`).
- `src/app/App.tsx` — `BrowserRouter` (`/` landing, `/dashboard`, `/deploy`, fallback → `/`); mounts global `ErrorBanner` via `useWeb3()`.
- `src/app/pages/DashboardPage.tsx` — Owns `selectedRegion` and `drawerOpen` state.
- `src/components/map/` — R3F canvas, procedural landmasses/towers, and `regionData.ts` (fixed keys: `hong-kong-island`, `kowloon`, `new-territories`).
- `src/components/dashboard/` — KPI strip, region selector, `MarketIntelligenceCard`, and mortgage trigger cards.
- `src/components/mortgage/MortgageDrawer.tsx` — Right-side drawer with free-input loan, live repayment/DSR, and `submitApplication` receipt.
- `src/components/web3/` — Wallet connect & borrow triggers, plus `ContractDeployer.tsx` for browser deployment at `/deploy`.
- `src/app/pages/DeployPage.tsx` — Route wrapper for `ContractDeployer`.
- `src/context/Web3Context.tsx` — `ethers` v6 MetaMask state, Sepolia chain enforcement, `provider`/`signer`, and shared error state.
- `src/lib/contract.ts` — Generated ABI + creation bytecode, stored-address helpers, region→enum map.
- `src/lib/constants.ts` — Re-exports Sepolia constants from root `constants.ts`.
- `src/vite-env.d.ts` — Declares `window.ethereum` for MetaMask.

## Conventions & Known Traps

- **Stack**: React 19, TypeScript, Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`), React Router 7, R3F 9 + drei, `framer-motion`, `lucide-react`, `ethers` v6. Do not install extra npm packages without explicit user approval.
- **Styling**: Reuse dark glass/aurora classes in `src/styles/globals.css` (`glass-card`, `glass-soft`, `section-eyebrow`, `app-bg`, `aurora`) before writing custom CSS.
- **Error Handling**: Surface all wallet/form errors via `ErrorBanner` or inline UI alerts, never silent `console.error`.
- **Traps to Avoid**:
  - Ignore intentionally empty placeholder files under `src/`.
  - Keep `Web3Provider` wrapping `App` in `src/main.tsx` (calling `useWeb3()` outside causes a white screen).

## Verification

Before concluding any task, run:
1. `npx tsc -b` — Must pass with 0 errors.
2. `npm run build` — Must complete cleanly.
3. Smoke-check routes (`/` and `/dashboard`) and verify no console/runtime white screens when switching regions or opening `MortgageDrawer`.

## Reference Docs

`PLAN.md` | `docs/WEB3.md` | `docs/REGION_DATA.md` | `docs/UI_STATES.md` | `docs/CONTRACT_NOTES.md`
