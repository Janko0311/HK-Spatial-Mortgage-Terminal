import { useEffect, useMemo, useState } from 'react'
import { Contract, formatEther } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ExternalLink,
  Info,
  Loader2,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../../context/Web3Context'
import {
  readStoredContractAddress,
  REGION_LABELS,
  REGION_TO_ENUM,
  SPATIAL_MORTGAGE_ABI,
} from '../../lib/contract'
import type { RegionKey } from '../map/regionData'

type Props = {
  open: boolean
  onClose: () => void
  selectedRegion: RegionKey | null
}

type SubmissionReceipt = {
  appId: string | null
  txHash: string
  loanHKD: string
  gasEth: string
  explorerUrl: string
}

const LOAN_PRESETS = ['100', '1,000', '100,000', '10,000,000']

const sanitizeDigits = (value: string) => value.replace(/[^0-9]/g, '')

const toBigInt = (value: string) => BigInt(sanitizeDigits(value) || '0')

const toNumber = (value: string) => {
  const parsed = Number(sanitizeDigits(value))
  return Number.isFinite(parsed) ? parsed : 0
}

const formatHKD = (value: number) =>
  new Intl.NumberFormat('en-HK', { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0
  )

function Field({
  label,
  hint,
  value,
  onChange,
  prefix,
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  prefix?: string
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {label}
        </span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-sky-400/50">
        {prefix && <span className="text-sm text-slate-400">{prefix}</span>}
        <input
          value={value}
          onChange={(event) => onChange(sanitizeDigits(event.target.value))}
          inputMode="numeric"
          className="mono w-full bg-transparent text-lg text-white outline-none"
        />
      </div>
    </label>
  )
}

export function MortgageDrawer({ open, onClose, selectedRegion }: Props) {
  const { isConnected, isConnecting, address, signer, connectWallet } = useWeb3()
  const [region, setRegion] = useState<RegionKey>('hong-kong-island')
  const [loanInput, setLoanInput] = useState('100000')
  const [incomeInput, setIncomeInput] = useState('50000')
  const [tenorInput, setTenorInput] = useState('30')
  const [propertyInput, setPropertyInput] = useState('0')
  const [downPaymentInput, setDownPaymentInput] = useState('0')
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null)

  useEffect(() => {
    if (selectedRegion) setRegion(selectedRegion)
  }, [selectedRegion, open])

  useEffect(() => {
    if (open) setDeployedAddress(readStoredContractAddress())
  }, [open])

  const loan = toNumber(loanInput)
  const income = toNumber(incomeInput)
  const tenor = toNumber(tenorInput)

  const figures = useMemo(() => {
    const principal = loan
    const months = Math.max(1, Math.floor(tenor) * 12)
    const monthlyRate = 0.035 / 12
    const monthlyPayment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
    const totalRepayment = monthlyPayment * months

    return {
      monthlyPayment: Number.isFinite(monthlyPayment) ? monthlyPayment : 0,
      totalRepayment: Number.isFinite(totalRepayment) ? totalRepayment : 0,
      totalInterest: Number.isFinite(totalRepayment - principal) ? totalRepayment - principal : 0,
      dsr: income > 0 && Number.isFinite(monthlyPayment) ? (monthlyPayment / income) * 100 : 0,
    }
  }, [loan, income, tenor])

  const handleSubmit = async () => {
    if (!signer || !deployedAddress || !isConnected) return

    if (loan <= 0 || income <= 0 || tenor <= 0) {
      setStatus('error')
      setErrorMessage('Loan amount, monthly income and tenor must all be greater than zero.')
      return
    }
    if (toNumber(downPaymentInput) > 100) {
      setStatus('error')
      setErrorMessage('Down payment cannot exceed 100%.')
      return
    }

    setStatus('submitting')
    setErrorMessage(null)
    setReceipt(null)

    try {
      const contract = new Contract(deployedAddress, SPATIAL_MORTGAGE_ABI, signer)
      const tx = await contract.submitApplication(
        REGION_TO_ENUM[region],
        toBigInt(propertyInput),
        toBigInt(downPaymentInput),
        toBigInt(incomeInput),
        toBigInt(tenorInput),
        toBigInt(loanInput)
      )
      const result = await tx.wait()

      let appId: string | null = null
      for (const log of result?.logs ?? []) {
        try {
          const parsed = contract.interface.parseLog(log)
          if (parsed?.name === 'ApplicationSubmitted') {
            appId = parsed.args.id.toString()
            break
          }
        } catch {
          continue
        }
      }

      const gasPrice = (result as any)?.gasPrice ?? 0n
      const gasWei = ((result as any)?.gasUsed ?? 0n) * gasPrice

      setReceipt({
        appId,
        txHash: tx.hash,
        loanHKD: formatHKD(loan),
        gasEth: Number(formatEther(gasWei)).toFixed(6),
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
      })
      setStatus('done')
    } catch (err: any) {
      setStatus('error')
      if (err?.code === 'ACTION_REJECTED' || err?.code === 4001) {
        setErrorMessage('You rejected the transaction in MetaMask.')
      } else {
        setErrorMessage(err?.shortMessage ?? err?.message ?? 'Submission failed.')
      }
    }
  }

  const ready = isConnected && Boolean(deployedAddress) && Boolean(signer)

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
            className="fixed right-4 top-4 z-[80] flex h-[calc(100vh-2rem)] w-[min(460px,95vw)] flex-col rounded-[30px] glass-card"
          >
            <div className="flex items-start justify-between border-b border-white/8 p-6">
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

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div
                className={`rounded-2xl border px-4 py-3 text-xs ${
                  ready
                    ? 'border-emerald-400/25 bg-emerald-400/8 text-emerald-200'
                    : 'border-amber-400/25 bg-amber-400/8 text-amber-200'
                }`}
              >
                {!isConnected ? (
                  <div className="flex items-center justify-between gap-3">
                    <span>Wallet not connected</span>
                    <button
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-950 disabled:opacity-50"
                    >
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                ) : !deployedAddress ? (
                  <div className="flex items-center justify-between gap-3">
                    <span>Contract not deployed on Sepolia</span>
                    <Link
                      to="/deploy"
                      className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-950"
                    >
                      Deploy <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5" />
                      Contract ready · {deployedAddress.slice(0, 6)}...{deployedAddress.slice(-4)}
                    </span>
                    <span className="mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </div>
                )}
              </div>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">
                  Region
                </span>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value as RegionKey)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none focus:border-sky-400/50"
                >
                  {(Object.keys(REGION_LABELS) as RegionKey[]).map((key) => (
                    <option key={key} value={key}>
                      {REGION_LABELS[key]}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <Field
                  label="Requested loan"
                  hint="free input · not tied to property price"
                  value={loanInput}
                  onChange={setLoanInput}
                  prefix="HK$"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {LOAN_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setLoanInput(sanitizeDigits(preset))}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      HK${preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Monthly income"
                  value={incomeInput}
                  onChange={setIncomeInput}
                  prefix="HK$"
                />
                <Field label="Tenor" value={tenorInput} onChange={setTenorInput} hint="years" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Property value"
                  hint="optional"
                  value={propertyInput}
                  onChange={setPropertyInput}
                  prefix="HK$"
                />
                <Field
                  label="Down payment %"
                  hint="optional"
                  value={downPaymentInput}
                  onChange={setDownPaymentInput}
                />
              </div>

              <div className="rounded-[24px] border border-sky-400/15 bg-sky-400/5 p-5">
                <div className="section-eyebrow">Live calculation</div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-slate-400">Monthly repayment</div>
                    <div className="mono mt-1 text-xl text-white">
                      HK${formatHKD(figures.monthlyPayment)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">DSR</div>
                    <div
                      className={`mono mt-1 text-xl ${
                        figures.dsr > 50 ? 'text-rose-300' : 'text-emerald-300'
                      }`}
                    >
                      {figures.dsr.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Total repayment</div>
                    <div className="mono mt-1 text-sm text-slate-200">
                      HK${formatHKD(figures.totalRepayment)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Total interest</div>
                    <div className="mono mt-1 text-sm text-slate-200">
                      HK${formatHKD(figures.totalInterest)}
                    </div>
                  </div>
                </div>
                <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-slate-400">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Indicative amortization at 3.5% p.a. DSR is monthly repayment divided
                  by monthly income. The contract stores your loan figure as-is.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!ready || status === 'submitting'}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting to Sepolia...
                  </>
                ) : (
                  <>
                    Submit on-chain application
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-2xl border border-rose-400/25 bg-rose-400/8 px-4 py-3 text-sm text-rose-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {receipt && (
                <div className="rounded-[24px] border border-emerald-400/25 bg-emerald-400/8 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                    <Check className="h-4 w-4" />
                    On-chain receipt
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Application ID</span>
                      <span className="mono text-white">#{receipt.appId ?? '—'}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Loan recorded</span>
                      <span className="mono text-white">HK${receipt.loanHKD}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Gas spent</span>
                      <span className="mono text-white">{receipt.gasEth} SEP</span>
                    </div>
                  </div>
                  <a
                    href={receipt.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mono mt-4 flex break-all text-[11px] text-sky-300 hover:underline"
                  >
                    {receipt.txHash} <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
                  </a>
                  <p className="mt-3 text-[11px] leading-5 text-emerald-200/70">
                    Tiny Sepolia gas, arbitrary recorded loan — exactly the demo behaviour.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
