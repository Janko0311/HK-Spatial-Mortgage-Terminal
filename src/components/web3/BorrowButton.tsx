import { ArrowRight } from 'lucide-react'
import { useWeb3 } from '../../context/Web3Context'

type Props = {
  onClick: () => void
}

export function BorrowButton({ onClick }: Props) {
  const { isConnected } = useWeb3()

  return (
    <button
      onClick={onClick}
      disabled={!isConnected}
      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.14)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none"
    >
      <span className="flex items-center gap-2">
        Apply Mortgage
        <span className="text-xs opacity-70">(借錢)</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  )
}
