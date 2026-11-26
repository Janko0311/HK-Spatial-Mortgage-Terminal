export type RegionKey = 'hong-kong-island' | 'kowloon' | 'new-territories'

export type RegionMeta = {
  id: RegionKey
  name: string
  position: [number, number, number]
  baseColor: string
}

export type RegionMarketData = {
  title: string
  status: string
  avgPrice: string
  avgPriceTrend: string
  avgPriceTrendUp: boolean
  estUnit: string
  mortgageRate: string
  ltv: string
  monthlyPayment: string
  trend: number[]
}

export const REGIONS: RegionMeta[] = [
  {
    id: 'new-territories',
    name: 'New Territories',
    position: [-3.4, 0, -1.4],
    baseColor: '#164e63',
  },
  {
    id: 'kowloon',
    name: 'Kowloon',
    position: [0, 0, 0.6],
    baseColor: '#0e7490',
  },
  {
    id: 'hong-kong-island',
    name: 'Hong Kong Island',
    position: [3.3, 0, 2.4],
    baseColor: '#155e75',
  },
]

export const REGION_MARKET_DATA: Record<RegionKey, RegionMarketData> = {
  'hong-kong-island': {
    title: 'Hong Kong Island',
    status: 'Prime Core',
    avgPrice: 'HK$ 19,850',
    avgPriceTrend: '+1.4% MoM',
    avgPriceTrendUp: true,
    estUnit: 'HK$ 9.93M',
    mortgageRate: '3.625%',
    ltv: 'Up to 70% LTV',
    monthlyPayment: 'HK$ 31,720/mo',
    trend: [19280, 19420, 19360, 19550, 19710, 19850],
  },
  kowloon: {
    title: 'Kowloon',
    status: 'High Liquidity',
    avgPrice: 'HK$ 16,420',
    avgPriceTrend: '+0.8% MoM',
    avgPriceTrendUp: true,
    estUnit: 'HK$ 8.21M',
    mortgageRate: '3.625%',
    ltv: 'Up to 70% LTV',
    monthlyPayment: 'HK$ 26,230/mo',
    trend: [16120, 16180, 16260, 16210, 16340, 16420],
  },
  'new-territories': {
    title: 'New Territories',
    status: 'Growth Belt',
    avgPrice: 'HK$ 12,380',
    avgPriceTrend: '-0.3% MoM',
    avgPriceTrendUp: false,
    estUnit: 'HK$ 6.19M',
    mortgageRate: '3.625%',
    ltv: 'Up to 70% LTV',
    monthlyPayment: 'HK$ 19,780/mo',
    trend: [12520, 12480, 12460, 12420, 12400, 12380],
  },
}
