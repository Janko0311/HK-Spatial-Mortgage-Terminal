import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

type Props = {
  title: string
  message: string
  onClose: () => void
}

export function ErrorBanner({ title, message, onClose }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        className="fixed left-1/2 top-6 z-[100] w-[min(760px,92vw)] -translate-x-1/2 rounded-2xl border border-red-300/15 bg-red-500/10 px-4 py-3 shadow-[0_10px_30px_rgba(239,68,68,0.15)] backdrop-blur-xl"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-red-500/10 p-2">
            <AlertTriangle className="h-4 w-4 text-red-300" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-200">{title}</p>
            <p className="mt-0.5 text-sm text-red-100/85">{message}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-red-200 transition hover:bg-red-400/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
