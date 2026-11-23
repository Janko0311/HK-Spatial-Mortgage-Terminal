# WEB3.md

## Network Target
- Ethereum Sepolia Testnet
- Chain ID (decimal): `11155111`
- Chain ID (hex): `0xaa36a7`

## Wallet Connection Flow
1. Check if `window.ethereum` exists
2. Create `BrowserProvider` from `ethers` v6
3. Request accounts
4. Check current chain
5. Switch to Sepolia if necessary
6. Read signer address
7. Read ETH balance
8. Update UI state

## Required Error Cases
- MetaMask not installed
- User rejects account connection
- User rejects network switch
- Unsupported network remains active
- Provider unavailable
- Balance read failure

## Contract Flow
- `/deploy` uses `ContractFactory` with bundled bytecode; MetaMask signs, no private key in repo
- Deployed address is stored in `localStorage` (`aura.spatialMortgage.address`)
- `Web3Context` exposes `provider` and `signer` for contract calls
- The mortgage drawer calls `submitApplication(region, propertyValue, downPaymentPercent, monthlyIncome, tenorYears, requestedLoan)`
- Application IDs are read from the `ApplicationSubmitted` event in the receipt
- The receipt shows gas spent in SEP alongside the recorded loan amount

## ethers v6 Reminder
Use:
- `new ethers.BrowserProvider(window.ethereum)`
- `await provider.getSigner()`
- `await provider.getBalance(address)`
- `ethers.formatEther(balance)`

Do NOT use v5 syntax:
- `ethers.providers.Web3Provider`
- `ethers.utils.formatEther`
