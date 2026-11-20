# White Screen Fix — Handoff Notes

Date: 2026-11-20
Scope: **white screen only**. No new features, no dependency changes, no contract/workflow work.

## 1. Symptom

Opening the app showed a blank white screen at `/`.

## 2. Root causes found

1. **Primary cause — empty React entry point.**
   `index.html` loads `/src/main.tsx`, but that file was **0 bytes**. Nothing was ever mounted into `#root`, so the page stayed blank.
   - Note: there is also a stale root-level `main.tsx` containing bootstrap code, but `index.html` never references it, and its relative imports (`./app/App`) would be wrong from the project root. It was intentionally left untouched.

2. **Secondary cause — unresolved module in the 3D scene.**
   `src/components/map/RegionMesh.tsx` imported `motion` from `framer-motion-3d`, which is **not in `package.json`**. This made `tsc`/Vite fail to resolve the module, so even after restoring the entry point the app could still fail to load.

3. **TypeScript blockers that prevented a clean build.**
   - `RegionMesh.tsx`: unused `name` prop.
   - `SpatialCanvas.tsx`: unused `useState` import.

## 3. Files modified

### 3.1 `src/main.tsx` — restored (was empty)

Now the canonical React bootstrap, matching what `index.html` expects:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import { Web3Provider } from './context/Web3Context'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
)
```

Why `Web3Provider`: `src/app/App.tsx` calls `useWeb3()` via `TopBar`/`BorrowButton`/`ErrorBanner`, and that hook throws without the provider.

### 3.2 `src/components/map/RegionMesh.tsx` — removed missing dependency

Before:

```tsx
import { motion } from 'framer-motion-3d'
...
<motion.group animate={{ y: ... }} transition={{ type: 'spring', ... }}>
```

After:
- Removed the `framer-motion-3d` import.
- Uses plain R3F `<group>` plus `useFrame` from `@react-three/fiber` (already a dependency) with `THREE.MathUtils.damp` to keep the hover/select lift animation.
- Uses the previously unused `name` prop as the group's `name`, resolving the TS error without changing UI.

Key added code:

```tsx
import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const groupRef = useRef<THREE.Group>(null)

useFrame((_, delta) => {
  if (!groupRef.current) return
  const targetY = hovered || selected ? position[1] + 0.15 : position[1]
  groupRef.current.position.y = THREE.MathUtils.damp(
    groupRef.current.position.y,
    targetY,
    12,
    delta
  )
})

// ...

<group ref={groupRef} name={name} position={position} onClick={...} ...>
```

Rendering logic (terrain box, 80 buildings, selection ring, emissive hover state) is unchanged.

### 3.3 `src/components/map/SpatialCanvas.tsx` — cleanup only

Removed the unused `import { useState } from 'react'`. No JSX changes.

## 4. Verification performed

```bash
npm run build
```

Result before fix: failed with 3 TypeScript errors (`framer-motion-3d`, unused `name`, unused `useState`).

Result after fix: **passes** (`tsc -b && vite build`). Output includes `dist/index.html`, CSS, and JS bundle. Only remaining message is Vite's non-blocking chunk-size warning (bundle ~1.57 MB, Three.js).

Dev-server smoke test:

```bash
npm run dev -- --port 5199
curl -I http://localhost:5199/src/main.tsx          # 200
curl -I http://localhost:5199/src/components/map/RegionMesh.tsx  # 200
```

No Vite transform/resolve errors in the dev log after the fix.

`npm run lint` (`oxlint`) was not run as part of this fix; the build/typecheck is the authoritative check for the white-screen issue.

## 5. Project structure

```
spatial-mortgage-terminal/
├── index.html                  # Vite HTML; loads /src/main.tsx  ← real entry
├── main.tsx                    # stale duplicate bootstrap, NOT referenced (left untouched)
├── package.json                # React 19, Vite 8, Tailwind 4, R3F 9, three, ethers 6, framer-motion, oxlint
├── vite.config.ts              # react() + @tailwindcss/vite plugins
├── tailwind.config.js          # v3-style theme config (see §6 note)
├── tsconfig*.json              # app / node TS configs; strict unused checks
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── assets/                     # static design assets (hero.png, react.svg, vite.svg)
├── contracts/
│   └── SpatialMortgage.sol     # Solidity contract (not touched)
├── docs/
│   ├── CONTRACT_NOTES.md
│   ├── REGION_DATA.md
│   ├── UI_STATES.md
│   ├── WEB3.md
│   └── WHITE_SCREEN_FIX_HANDOFF.md  ← this file
├── src/
│   ├── main.tsx                # ✅ FIXED: React root + Web3Provider + globals.css
│   ├── index.css               # @import "tailwindcss" (currently unused by app)
│   ├── App.css                 # leftover Vite template CSS (unused)
│   ├── vite-env.d.ts
│   ├── types/
│   │   ├── ethereum.d.ts       # window.ethereum typing
│   │   └── mortgage.ts
│   ├── app/
│   │   ├── App.tsx             # full-screen layout: SpatialCanvas + TopBar + ErrorBanner + MortgageDrawer
│   │   └── providers.tsx       # empty placeholder (unused)
│   ├── styles/
│   │   └── globals.css         # Tailwind directives + dark #090b14 base + .glass-panel / .mono
│   ├── context/
│   │   ├── Web3Context.tsx     # MetaMask connect, Sepolia switch, accounts/chain event handling
│   │   └── UIContext.tsx       # empty placeholder (unused)
│   ├── lib/
│   │   ├── constants.ts        # Sepolia chain id/params, region ids
│   │   ├── format.ts
│   │   ├── mortgage.ts
│   │   └── cn.ts
│   ├── components/
│   │   ├── hud/
│   │   │   ├── TopBar.tsx      # brand + network label + wallet/borrow controls
│   │   │   ├── ErrorBanner.tsx # framer-motion error toast
│   │   │   ├── GlassPanel.tsx  # empty placeholder (unused)
│   │   │   └── NetworkPill.tsx # empty placeholder (unused)
│   │   ├── map/
│   │   │   ├── SpatialCanvas.tsx  # ✅ FIXED: removed unused useState
│   │   │   ├── RegionMesh.tsx     # ✅ FIXED: no framer-motion-3d; useFrame hover lift
│   │   │   ├── regionData.ts      # region keys, positions, colors
│   │   │   ├── TerrainBase.tsx    # empty placeholder (unused)
│   │   │   ├── WaterPlane.tsx     # empty placeholder (unused)
│   │   │   └── SceneLights.tsx    # empty placeholder (unused)
│   │   ├── mortgage/
│   │   │   ├── MortgageDrawer.tsx # right-side drawer shell
│   │   │   ├── MortgageForm.tsx   # empty placeholder (unused)
│   │   │   └── MortgageStats.tsx  # empty placeholder (unused)
│   │   ├── ui/
│   │   │   ├── Badge.tsx          # empty placeholder (unused)
│   │   │   ├── Button.tsx         # empty placeholder (unused)
│   │   │   └── ToastHost.tsx      # empty placeholder (unused)
│   │   └── web3/
│   │       ├── ConnectWalletButton.tsx
│   │       ├── BorrowButton.tsx   # enabled only when connected to Sepolia
│   │       └── WalletInfoPill.tsx # empty placeholder (unused)
│   └── ... (see tree above)
└── dist/                       # build output generated during verification
```

## 6. Deliberately NOT changed (out of scope)

These are observations for the next agent, not white-screen blockers:

- **Duplicate entry file:** root `main.tsx` still contains old bootstrap code with root-relative imports. `index.html` correctly uses `src/main.tsx`. Do not switch to the root file without fixing its imports.
- **Empty placeholder files:** `src/app/providers.tsx`, `src/context/UIContext.tsx`, and several `components/**` files are 0 bytes but are not imported anywhere, so they do not affect rendering.
- **Tailwind v4 config:** `src/styles/globals.css` uses legacy `@tailwind base/components/utilities` directives and `tailwind.config.js` is not explicitly loaded via `@config`. Built CSS contains standard utilities (layout, cyan colors) but **not** custom theme utilities such as `.bg-void`, `.shadow-neon`, `.shadow-danger`. The dark background still comes from `globals.css` (`#090b14` on `html/body/#root`), so this did not cause the white screen. If polish is requested later, migrate to `@import "tailwindcss";` + `@config "../tailwind.config.js";` in `globals.css`.
- **Bundle size warning:** Three.js makes the JS chunk >500 kB. Not a rendering failure.
- **No wallet connected:** `Apply Mortgage (借錢)` starts disabled by design until MetaMask connects on Sepolia.
