# CONTRACT_NOTES.md

## Contract Purpose
This smart contract is a testnet-only mortgage application registry.

## What it does
- Stores mortgage applications
- Tracks approval/rejection status
- Emits events for frontend UI
- Simulates approved loan amount
- Records a free-form loan amount chosen by the applicant

## What it does NOT do
- No real collateral enforcement
- No production lending logic
- No legal/AML/KYC checks
- No automatic native ETH creation
- No ETH is held or transferred; Sepolia ETH only pays gas

## Loan amount semantics
`requestedLoanHKD` is a free input from the frontend. It is deliberately NOT derived
from `propertyValueHKD` or the down payment. `propertyValueHKD` is optional context
and may be `0`. This means a tiny Sepolia gas spend can record any loan figure, small
or arbitrarily large, which is the intended demo behaviour.

## Deployment (browser-only, no secrets)
1. Connect MetaMask to Sepolia (`0xaa36a7`).
2. Open `/deploy` (sidebar "Deploy" link).
3. Click "Deploy to Sepolia" and confirm in MetaMask.
4. The deployed address is saved to `localStorage` under
   `aura.spatialMortgage.address` and reused by the mortgage drawer.
5. "Forget" clears the stored address.

No private key is stored in the repo. Hardhat/Foundry are intentionally not used.

## Regenerate the frontend bindings
The ABI and creation bytecode live in `src/lib/contract.ts`. After editing
`contracts/SpatialMortgage.sol`, recompile and regenerate that file:

```sh
npx --yes solc@0.8.26 --abi --bin --optimize \
  -o /tmp/spatial-mortgage-solc contracts/SpatialMortgage.sol
```

Copy the generated `.abi` and `.bin` into `SPATIAL_MORTGAGE_ABI` and
`SPATIAL_MORTGAGE_BYTECODE` in `src/lib/contract.ts`.

## Frontend Debug Checklist
- Wallet connected to Sepolia
- Contract address present in localStorage (`/deploy` shows "Contract ready")
- ABI matches deployed contract
- User has testnet ETH for gas
- Function arguments follow contract types (uint256 values are BigInts)
- Region enum values match frontend mapping (HK Island 0, Kowloon 1, NT 2)
