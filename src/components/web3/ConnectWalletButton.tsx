import { Loader2, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWeb3 } from '../../context/Web3Context'
import { formatBalance, truncateAddress } from '../../lib/format'

export function ConnectWalletButton() {
  const { connectWallet, isConnecting, isConnected, address, balance } = useWeb3()

  if (isConnected && address) {
    return (
      <motion.div
        layout
        className="glass-soft aurora-ring relative rounded-full px-4 py-2.5 text-sm text-white"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
            <Wallet className="h-4 w-4 text-sky-300" />
          </div>

          <div className="leading-tight">
            <div className="mono text-sm text-white">{truncateAddress(address)}</div>
            <div className="mono text-[11px] text-slate-300">
              {formatBalance(balance ?? '0')} SEP
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="glass-soft aurora-ring relative rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:scale-[1.02] disabled:opacity-60"
    >
      <span className="flex items-center gap-2">
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin text-sky-300" />
        ) : (
          <Wallet className="h-4 w-4 text-sky-300" />
        )}
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </button>
  )
}
