# HK Spatial Mortgage Terminal

A commercial-style frontend demo for exploring Hong Kong mortgage scenarios through a spatial (3D) dashboard. Users connect a MetaMask wallet on the Sepolia testnet, pick one of Hong Kong's three major regions, inspect demo market signals, and open a mortgage application drawer.

This is a **frontend-first UI prototype and testnet simulation**. It is not a production lending product: no real underwriting, KYC/AML, collateral enforcement, or fund transfer is performed. All market figures and loan outcomes are illustrative.

## What the app does

- **Landing page (`/`)** — product intro, wallet onboarding, feature overview, and entry into the dashboard.
- **Dashboard (`/dashboard`)** — sidebar navigation, KPI cards, region selector, interactive 3D Hong Kong view, market intelligence card, and mortgage action card.
- **Wallet onboarding** — Connect Wallet via MetaMask; validates and switches to Sepolia automatically, with user-facing errors for missing wallet, rejected requests, and network problems.
- **Region intelligence** — select Hong Kong Island, Kowloon, or New Territories from the region card or directly in the 3D scene; the market card updates with demo average price, indicative LTV, and demand signal.
- **Mortgage entry point** — the "Apply Mortgage (借錢)" button and mortgage drawer are currently UI shell only; form fields, repayment calculator, and contract submission are planned (see Roadmap).

Unknown routes redirect to `/`.

## Quick start

Requirements:
- Node.js **20.19+** or **22.12+** (Vite 8 requirement)
- npm
- MetaMask browser extension (only needed to exercise the wallet flow)

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # type-check and produce dist/
```

Open the URL printed by Vite (usually `http://localhost:5173`). The 3D dashboard and wallet features do not need a backend or API keys; the Solidity contract is not deployed or wired into the UI yet.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript 7 |
| Build/dev server | Vite 8 with `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, custom glass/aurora styles in `src/styles/globals.css` |
| Routing | React Router 7 (`BrowserRouter` / `Routes`) |
| 3D | React Three Fiber 9, `@react-three/drei`, `three` |
| Animation / icons | Framer Motion, Lucide React |
| Web3 | `ethers` v6 `BrowserProvider`, MetaMask `window.ethereum` |
| Contract source | Solidity `^0.8.24` (`contracts/SpatialMortgage.sol`) |

## Project layout

```text
index.html                  Vite entry; mounts #root via /src/main.tsx
vite.config.ts              React + Tailwind plugins
constants.ts                Shared Sepolia constants and region IDs (re-exported via src/lib/constants.ts)
contracts/
  SpatialMortgage.sol       Testnet mortgage-application registry (simulation)
docs/                       Product and implementation notes (see below)
src/
  main.tsx                  React bootstrap: StrictMode -> Web3Provider -> App
  app/
    App.tsx                 BrowserRouter, global error banner, route table
    pages/
      LandingPage.tsx       Marketing/onboarding page
      DashboardPage.tsx     Main card-based product layout
  components/
    dashboard/              KPI, region control, market, mortgage action cards
    layout/                 Sidebar and dashboard top bar
    hud/                    Error banner
    map/                    R3F canvas, procedural HK landmass, region data
    mortgage/               Mortgage drawer shell
    web3/                   Connect-wallet and borrow buttons
  context/
    Web3Context.tsx         MetaMask connect, Sepolia switching, account/chain events
  lib/                      Constants, formatting, helpers
  styles/globals.css        Dark theme base and reusable glass/aurora classes
```

## Web3 behaviour

- Network target: **Ethereum Sepolia** — chain ID `11155111` / `0xaa36a7`.
- Connection flow: detect `window.ethereum` → request accounts → check chain → switch/add Sepolia if needed → read address, chain ID, and ETH balance with `ethers` v6.
- `Apply Mortgage (借錢)` stays disabled until a wallet is connected on Sepolia.
- Errors are shown in the shared `ErrorBanner` rather than the browser console, for example: MetaMask missing, request rejected, or network switch failure.

See `docs/WEB3.md` for the full flow and `docs/UI_STATES.md` for the expected UI states.

## Smart contract

`contracts/SpatialMortgage.sol` is a **testnet-only simulation** of a mortgage application registry. It stores applications (region, property value, down payment, income, tenor, requested/approved loan), tracks `Pending / Approved / Rejected / Cancelled` status, emits events, and exposes owner-only approve/reject plus applicant cancel. It performs no real lending logic and is not currently called from the frontend.

See `docs/CONTRACT_NOTES.md` before integrating it.

## Roadmap

From `PLAN.md`:

1. **Phase 1 (active)** — commercial HUD shell, landing/dashboard split, wallet onboarding, KPI/3D/market/mortgage sections, procedural Hong Kong model, Sepolia validation.
2. **Phase 2** — region intelligence card and bank-style mortgage application drawer.
3. **Phase 3 (locked)** — Blender MCP terrain and landmark upgrade to replace the procedural model.

## Current limitations

- The mortgage drawer is a UI shell; no form, repayment calculator, or contract submission yet.
- Market figures are static demo data in `MarketIntelligenceCard.tsx` and KPI cards; there is no live data source.
- The 3D map uses procedural polygons/towers, not GIS-accurate boundaries (see `docs/REGION_DATA.md`).
- Some placeholder files under `src/` are empty and unused.
- A Vite chunk-size warning from Three.js is expected during build and does not block rendering.

## Documentation

- `PLAN.md` — phased roadmap and current phase
- `docs/WEB3.md` — wallet/network contract
- `docs/REGION_DATA.md` — spatial model strategy and region layout
- `docs/UI_STATES.md` — expected UI states for wallet and region interactions
- `docs/CONTRACT_NOTES.md` — smart-contract scope and integration checklist
- `docs/WHITE_SCREEN_FIX_HANDOFF.md` — notes from a prior white-screen investigation
