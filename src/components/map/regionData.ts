export type RegionKey = 'hong-kong-island' | 'kowloon' | 'new-territories'

export type RegionMeta = {
  id: RegionKey
  name: string
  position: [number, number, number]
  baseColor: string
}

export type PricePoint = {
  month: string
  value: number
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
  priceHistory: PricePoint[]
  demand: string
  note: string
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

// Demo visualization data (HK$/sq.ft), shaped for trend charting.
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
    priceHistory: [
      { month: 'Jun', value: 18980 },
      { month: 'Jul', value: 19120 },
      { month: 'Aug', value: 19040 },
      { month: 'Sep', value: 19280 },
      { month: 'Oct', value: 19420 },
      { month: 'Nov', value: 19360 },
      { month: 'Dec', value: 19550 },
      { month: 'Jan', value: 19640 },
      { month: 'Feb', value: 19580 },
      { month: 'Mar', value: 19710 },
      { month: 'Apr', value: 19690 },
      { month: 'May', value: 19850 },
    ],
    demand: 'High',
    note: 'Prime district demand remains strongest around the core finance corridor.',
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
    priceHistory: [
      { month: 'Jun', value: 15880 },
      { month: 'Jul', value: 15960 },
      { month: 'Aug', value: 16020 },
      { month: 'Sep', value: 16120 },
      { month: 'Oct', value: 16180 },
      { month: 'Nov', value: 16260 },
      { month: 'Dec', value: 16210 },
      { month: 'Jan', value: 16290 },
      { month: 'Feb', value: 16250 },
      { month: 'Mar', value: 16340 },
      { month: 'Apr', value: 16310 },
      { month: 'May', value: 16420 },
    ],
    demand: 'High',
    note: 'Dense urban mix and transport access sustain healthy mortgage demand.',
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
    priceHistory: [
      { month: 'Jun', value: 12640 },
      { month: 'Jul', value: 12610 },
      { month: 'Aug', value: 12570 },
      { month: 'Sep', value: 12520 },
      { month: 'Oct', value: 12480 },
      { month: 'Nov', value: 12460 },
      { month: 'Dec', value: 12420 },
      { month: 'Jan', value: 12440 },
      { month: 'Feb', value: 12410 },
      { month: 'Mar', value: 12400 },
      { month: 'Apr', value: 12360 },
      { month: 'May', value: 12380 },
    ],
    demand: 'Moderate',
    note: 'Wider supply and newer development areas support stronger affordability.',
  },
}
