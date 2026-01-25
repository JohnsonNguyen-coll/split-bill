import { useAccount, useDisconnect, useBalance, usePublicClient } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export const useWallet = () => {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const publicClient = usePublicClient()
  
  const { data: balance } = useBalance({
    address: address,
  })

  return {
    address,
    isConnected,
    isConnecting,
    balance,
    connect: () => {
      if (openConnectModal) {
        openConnectModal()
      }
    },
    disconnect,
    openConnectModal,
    provider: publicClient, // For compatibility with existing code
  }
}