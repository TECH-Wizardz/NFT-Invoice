import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import { BrowserProvider } from 'ethers';

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { connected, sdk } = useSDK();

  // Initial setup - check if we should be connected or not
  useEffect(() => {
    const checkConnection = async () => {
      // Check localStorage first to see if we should be disconnected
      const disconnectedFlag = localStorage.getItem('wallet_disconnected');
      
      if (disconnectedFlag === 'true') {
        // User explicitly disconnected before, so stay disconnected
        setAccount(null);
        setChainId(null);
        setIsConnected(false);
        return;
      }
      
      // No explicit disconnect - set up provider
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
        
        // Check if already connected
        if (connected) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              setAccount(accounts[0]);
              setIsConnected(true);
              localStorage.removeItem('wallet_disconnected');
              
              const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
              setChainId(parseInt(chainIdHex as string, 16));
            }
          } catch (error) {
            console.error("Failed to get accounts", error);
          }
        }
      }
    };
    
    checkConnection();
  }, [connected]);

  const handleConnect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const provider = new BrowserProvider(window.ethereum);
          setProvider(provider);
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Remove disconnected flag since we're now connected
          localStorage.removeItem('wallet_disconnected');
          
          // Get the chain ID
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex as string, 16));
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = () => {
    // Set explicit disconnect flag in localStorage
    localStorage.setItem('wallet_disconnected', 'true');
    
    // Update state
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    
    // Try to disconnect from SDK if available
    if (sdk) {
      try {
        sdk.terminate();
      } catch (error) {
        console.error('Error terminating SDK connection:', error);
      }
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        provider,
        connect: handleConnect,
        disconnect: handleDisconnect,
        isConnected,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  return useContext(Web3Context);
}; 