export type RegionKey = 'hong-kong-island' | 'kowloon' | 'new-territories'

export type RegionMeta = {
  id: RegionKey
  name: string
  position: [number, number, number]
  baseColor: string
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
