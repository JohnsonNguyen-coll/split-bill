// Arc Network Configuration
export const ARC_NETWORK = {
  chainId: 0x1a2, // Update with actual Arc Testnet Chain ID
  name: 'Arc Testnet',
  rpcUrl: import.meta.env.VITE_ARC_TESTNET_RPC_URL || 'https://rpc.testnet.arc.network',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  blockExplorer: 'https://explorer.testnet.arc.network', // Update if available
};

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  BillSplitter: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  USDC: import.meta.env.VITE_USDC_ADDRESS || '0x3600000000000000000000000000000000000000',
};

// USDC has 6 decimals on Arc Network
export const USDC_DECIMALS = 6;











