# UI_STATES.md

## Wallet Disconnected
- Show `Connect Wallet` button
- Disable `Apply Mortgage (借錢)` button
- Network pill still visible

## MetaMask Missing
- Show red neon banner:
  "MetaMask not detected. Please install MetaMask."

## Wrong Network
- Show warning/error banner:
  "Wrong network detected. Please switch to Sepolia Testnet."
- Attempt auto-switch
- If rejected, keep UI in protected state

## Wallet Connected
- Show truncated address
- Show Sepolia ETH balance
- Enable `Apply Mortgage (借錢)` trigger

## Region Selected
- Highlight selected region
- Future: open right-side analysis card

## Page Layout Principle
The application should behave like a structured commercial fintech website,
not a debug overlay on top of a blank canvas.

Required primary sections:
1. Hero / product intro
2. Wallet onboarding
3. Spatial visualization
4. Market intelligence
5. Mortgage CTA / application flow

