export function truncateAddress(address: string, start = 6, end = 4) {
  if (!address) return ''
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatBalance(balance: string, decimals = 4) {
  const num = Number(balance)
  if (Number.isNaN(num)) return '0.0000'
  return num.toFixed(decimals)
}
