type Props = {
  onOpen: () => void
}

export function MortgageActionCard({ onOpen }: Props) {
  return (
    <div className="glass-card rounded-[32px] p-6">
      <div className="section-eyebrow">Mortgage Action</div>
      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
        Ready for the lending workflow
      </h3>

      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        Connect wallet, inspect region-level market context, and launch the mortgage
        drawer as the next step in the application journey.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onOpen}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Open Mortgage Terminal
        </button>

        <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
          View Demo Flow
        </button>
      </div>
    </div>
  )
}
