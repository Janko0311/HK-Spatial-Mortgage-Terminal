import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BrowserProvider, ethers } from 'ethers'
import {
  SEPOLIA_CHAIN_ID_HEX,
  SEPOLIA_NETWORK_PARAMS,
} from '../lib/constants'

type Web3Error = {
  title: string
  message: string
}

type Web3State = {
  address: string | null
  balance: string | null
  chainId: string | null
  isConnected: boolean
  isConnecting: boolean
  provider: BrowserProvider | null
  error: Web3Error | null
  connectWallet: () => Promise<void>
  clearError: () => void
}

const Web3Context = createContext<Web3State | null>(null)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Web3Error | null>(null)

  const clearError = () => setError(null)

  const setUiError = (title: string, message: string) => {
    setError({ title, message })
  }

  const readWalletState = useCallback(async (browserProvider: BrowserProvider) => {
    const signer = await browserProvider.getSigner()
    const userAddress = await signer.getAddress()
    const network = await browserProvider.getNetwork()
    const walletBalance = await browserProvider.getBalance(userAddress)

    setAddress(userAddress)
    setChainId(`0x${network.chainId.toString(16)}`)
    setBalance(ethers.formatEther(walletBalance))
  }, [])

  const ensureSepolia = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('METAMASK_MISSING')
    }

    const currentChainId = (await window.ethereum.request({
      method: 'eth_chainId',
    })) as string

    if (currentChainId === SEPOLIA_CHAIN_ID_HEX) {
      return
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      })
    } catch (switchError: any) {
      if (switchError?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SEPOLIA_NETWORK_PARAMS],
        })
      } else {
        throw switchError
      }
    }
  }, [])

  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    clearError()

    try {
      if (!window.ethereum) {
        setUiError('MetaMask Missing', 'MetaMask not detected. Please install MetaMask.')
        return
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await ensureSepolia()

      const browserProvider = new BrowserProvider(window.ethereum)
      setProvider(browserProvider)

      await readWalletState(browserProvider)
    } catch (err: any) {
      if (err?.code === 4001) {
        setUiError('Request Rejected', 'You rejected the MetaMask request.')
      } else {
        setUiError(
          'Wallet Connection Failed',
          'Unable to connect wallet or switch to Sepolia Testnet.'
        )
      }
    } finally {
      setIsConnecting(false)
    }
  }, [ensureSepolia, readWalletState])

  useEffect(() => {
    if (!window.ethereum?.on) return

    const handleAccountsChanged = async (accounts: string[]) => {
      if (!accounts.length) {
        setAddress(null)
        setBalance(null)
        return
      }

      try {
        const browserProvider = new BrowserProvider(window.ethereum!)
        setProvider(browserProvider)
        await readWalletState(browserProvider)
      } catch {
        setUiError('Account Update Failed', 'Could not refresh wallet account data.')
      }
    }

    const handleChainChanged = async () => {
      try {
        const browserProvider = new BrowserProvider(window.ethereum!)
        setProvider(browserProvider)
        await readWalletState(browserProvider)
      } catch {
        setUiError('Network Update Failed', 'Could not refresh network data.')
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [readWalletState])

  const value = useMemo(
    () => ({
      address,
      balance,
      chainId,
      isConnected: Boolean(address && chainId === SEPOLIA_CHAIN_ID_HEX),
      isConnecting,
      provider,
      error,
      connectWallet,
      clearError,
    }),
    [address, balance, chainId, isConnecting, provider, error, connectWallet]
  )

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider')
  }
  return context
}
