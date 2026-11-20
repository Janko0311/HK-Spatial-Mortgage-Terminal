# CONTRACT_NOTES.md

## Contract Purpose
This smart contract is a testnet-only mortgage application registry.

## What it does
- Stores mortgage applications
- Tracks approval/rejection status
- Emits events for frontend UI
- Simulates approved loan amount

## What it does NOT do
- No real collateral enforcement
- No production lending logic
- No legal/AML/KYC checks
- No automatic native ETH creation

## Frontend Debug Checklist
- Wallet connected to Sepolia
- Contract address correct
- ABI matches deployed contract
- User has testnet ETH for gas
- Function arguments follow contract types
- Region enum values match frontend mapping
