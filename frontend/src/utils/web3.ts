import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARC_NETWORK } from '../config/constants';
import { BILL_SPLITTER_ABI, USDC_ABI } from '../config/contractABI';

// Get provider
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(ARC_NETWORK.rpcUrl);
};

// Get signer
export const getSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  }
  throw new Error('No wallet connected');
};

// Get contract instance
export const getBillSplitterContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.BillSplitter,
    BILL_SPLITTER_ABI,
    signer
  );
};

// Get read-only contract instance
export const getBillSplitterContractReadOnly = () => {
  const provider = getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.BillSplitter,
    BILL_SPLITTER_ABI,
    provider
  );
};

// Get USDC contract
export const getUSDCContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.USDC,
    USDC_ABI,
    signer
  );
};

// Get USDC contract read-only
export const getUSDCContractReadOnly = () => {
  const provider = getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.USDC,
    USDC_ABI,
    provider
  );
};

// Format USDC amount (6 decimals)
export const formatUSDC = (amount: bigint | string | null | undefined): string => {
  if (amount === null || amount === undefined) {
    return '0.00';
  }
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  return ethers.formatUnits(amountBigInt, 6);
};

// Parse USDC amount (6 decimals)
export const parseUSDC = (amount: string): bigint => {
  return ethers.parseUnits(amount, 6);
};

// Format address
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.ethereum) return false;
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts.length > 0;
};

// Connect wallet
export const connectWallet = async (): Promise<string> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // Switch to Arc Network if needed
    await switchToArcNetwork();

    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Switch to Arc Network
export const switchToArcNetwork = async () => {
  if (typeof window === 'undefined' || !window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${ARC_NETWORK.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${ARC_NETWORK.chainId.toString(16)}`,
              chainName: ARC_NETWORK.name,
              nativeCurrency: ARC_NETWORK.nativeCurrency,
              rpcUrls: [ARC_NETWORK.rpcUrl],
              blockExplorerUrls: ARC_NETWORK.blockExplorer ? [ARC_NETWORK.blockExplorer] : [],
            },
          ],
        });
      } catch (addError) {
        console.error('Error adding Arc Network:', addError);
      }
    } else {
      console.error('Error switching to Arc Network:', switchError);
    }
  }
};


