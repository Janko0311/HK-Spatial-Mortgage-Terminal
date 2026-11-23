import { useEffect, useState } from 'react'
import { ContractFactory } from 'ethers'
import { Check, Copy, ExternalLink, Rocket, Trash2, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../../context/Web3Context'
import {
  clearStoredContractAddress,
  readStoredContractAddress,
  SPATIAL_MORTGAGE_ABI,
  SPATIAL_MORTGAGE_BYTECODE,
  writeStoredContractAddress,
} from '../../lib/contract'

type DeployStatus = 'idle' | 'deploying' | 'confirming' | 'done' | 'error'

export function ContractDeployer() {
  const { isConnected, isConnecting, address, signer, connectWallet } = useWeb3()
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null)
  const [status, setStatus] = useState<DeployStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setDeployedAddress(readStoredContractAddress())
  }, [])

  const handleDeploy = async () => {
    if (!signer || !isConnected) return

    setStatus('deploying')
    setMessage(null)
    setTxHash(null)
    setCopied(false)

    try {
      const factory = new ContractFactory(
        SPATIAL_MORTGAGE_ABI,
        SPATIAL_MORTGAGE_BYTECODE,
        signer
      )
      const contract = await factory.deploy()
      const deploymentTx = contract.deploymentTransaction()
      setTxHash(deploymentTx?.hash ?? null)
      setStatus('confirming')

      await contract.waitForDeployment()
      const nextAddress = await contract.getAddress()

      writeStoredContractAddress(nextAddress)
      setDeployedAddress(nextAddress)
      setStatus('done')
      setMessage('Contract deployed. The mortgage drawer is now wired to this instance.')
    } catch (err: any) {
      setStatus('error')
      if (err?.code === 'ACTION_REJECTED' || err?.code === 4001) {
        setMessage('You rejected the deployment in MetaMask.')
      } else {
        setMessage(err?.shortMessage ?? err?.message ?? 'Deployment failed.')
      }
    }
  }

  const handleCopy = async () => {
    if (!deployedAddress) return
    try {
      await navigator.clipboard.writeText(deployedAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setMessage('Clipboard unavailable. Select the address and copy it manually.')
    }
  }

  const handleClear = () => {
    clearStoredContractAddress()
    setDeployedAddress(null)
    setTxHash(null)
    setCopied(false)
    setStatus('idle')
    setMessage('Stored contract address cleared.')
  }

  const busy = status === 'deploying' || status === 'confirming'

  return (
    <div className="site-shell">
      <div className="mx-auto max-w-3xl space-y-5 py-8">
        <div className="glass-card rounded-[32px] p-8">
          <div className="section-eyebrow">Developer Console / Sepolia</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
            Deploy SpatialMortgage
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Your MetaMask signs the deployment transaction, so no private key is ever
            stored in this app. A small amount of Sepolia ETH is used for gas only —
            the loan amounts recorded by the contract are independent of that.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Network: Sepolia (0xaa36a7)
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Bytecode: bundled from SpatialMortgage.sol
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Secrets in repo: none
            </span>
          </div>
        </div>

        <div className="glass-soft rounded-[32px] p-8">
          {!isConnected ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-white">
                <Wallet className="h-5 w-5 text-sky-300" />
                <span className="text-lg font-medium">Connect your wallet first</span>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Connect MetaMask on Sepolia to deploy and become the contract owner.
              </p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Deployer
                </div>
                <div className="mono mt-2 break-all text-sm text-white">{address}</div>
              </div>

              {deployedAddress ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/8 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                      <Check className="h-4 w-4" />
                      Contract deployed
                    </div>
                    <div className="mono mt-3 break-all text-sm text-white">
                      {deployedAddress}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied' : 'Copy address'}
                      </button>
                      <a
                        href={`https://sepolia.etherscan.io/address/${deployedAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Etherscan
                      </a>
                      <button
                        onClick={handleClear}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Forget
                      </button>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    Open mortgage terminal
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleDeploy}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Rocket className="h-4 w-4" />
                  {status === 'deploying'
                    ? 'Waiting for MetaMask...'
                    : status === 'confirming'
                      ? 'Waiting for confirmation...'
                      : 'Deploy to Sepolia'}
                </button>
              )}

              {txHash && (
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Transaction
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mono mt-2 flex break-all text-xs text-sky-300 hover:underline"
                  >
                    {txHash}
                  </a>
                </div>
              )}

              {message && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    status === 'error'
                      ? 'border-rose-400/25 bg-rose-400/8 text-rose-200'
                      : 'border-white/8 bg-white/5 text-slate-300'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="glass-card rounded-[32px] p-8 text-sm leading-7 text-slate-300">
          <div className="section-eyebrow">Demo semantics</div>
          <p className="mt-3">
            The requested loan is a free input. It is not capped by property value, and
            the contract never holds ETH. Sepolia ETH pays for gas only — you can record
            a loan of 100 HKD or 100,000,000 HKD with the same tiny gas spend.
          </p>
          <Link to="/dashboard" className="mt-4 inline-block text-sky-300 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
