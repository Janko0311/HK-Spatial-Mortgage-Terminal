export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7'
export const SEPOLIA_CHAIN_ID_DEC = 11155111

export const SEPOLIA_NETWORK_PARAMS = {
  chainId: SEPOLIA_CHAIN_ID_HEX,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
}

export const REGION_IDS = {
  HK_ISLAND: 'hong-kong-island',
  KOWLOON: 'kowloon',
  NEW_TERRITORIES: 'new-territories',
} as const
