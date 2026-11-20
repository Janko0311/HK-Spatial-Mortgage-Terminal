import { Search } from 'lucide-react'
import { ConnectWalletButton } from '../web3/ConnectWalletButton'
import { BorrowButton } from '../web3/BorrowButton'

type Props = {
  onBorrowClick: () => void
}

export function DashboardTopBar({ onBorrowClick }: Props) {
  return (
    <div className="glass-card rounded-[28px] px-5 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="section-eyebrow">Overview</div>
          <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
            HK Spatial Mortgage Dashboard
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-slate-400">
            <Search className="h-4 w-4" />
            Search regions, loans, or metrics...
          </div>

          <div className="flex items-center gap-3">
            <ConnectWalletButton />
            <BorrowButton onClick={onBorrowClick} />
          </div>
        </div>
      </div>
    </div>
  )
}
