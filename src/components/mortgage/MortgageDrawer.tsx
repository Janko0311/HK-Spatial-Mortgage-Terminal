import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
}

export function MortgageDrawer({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed right-4 top-4 z-[80] h-[calc(100vh-2rem)] w-[min(460px,95vw)] rounded-[30px] glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Mortgage Terminal
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Apply Mortgage <span className="text-slate-400">(借錢)</span>
                </h2>
              </div>

              <button
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/8 bg-white/5 p-5 text-sm leading-6 text-slate-300">
              This is the new mortgage drawer shell for the dashboard UI.
              <br />
              Next step: add mortgage form fields, repayment calculator, and simulated contract submission.
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
