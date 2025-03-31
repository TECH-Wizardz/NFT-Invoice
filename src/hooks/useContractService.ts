import { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ERC20TokenService } from '../services/ERC20TokenService';
import { InvoiceNFTService } from '../services/InvoiceNFTService';
import { LendingMarketplaceService } from '../services/LendingMarketplaceService';

export const useContractService = () => {
  const { provider, account, isConnected } = useWeb3();
  const [invoiceNFTService, setInvoiceNFTService] = useState<InvoiceNFTService | null>(null);
  const [lendingMarketplaceService, setLendingMarketplaceService] = useState<LendingMarketplaceService | null>(null);
  const [tokenServices, setTokenServices] = useState<Map<string, ERC20TokenService>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get supported token addresses from env
  const getSupportedTokens = () => {
    return import.meta.env.VITE_SUPPORTED_TOKENS?.split(',') || [];
  };

  // Initialize ERC20 token service for a specific token
  const initTokenService = async (tokenAddress: string) => {
    if (!provider) return null;
    
    try {
      const tokenService = new ERC20TokenService(provider, tokenAddress);
      await tokenService.init();
      return tokenService;
    } catch (err) {
      console.error(`Error initializing token service for ${tokenAddress}:`, err);
      return null;
    }
  };

  // Add a new token service
  const addTokenService = async (tokenAddress: string) => {
    if (!provider || !isInitialized) return false;
    
    try {
      const tokenService = await initTokenService(tokenAddress);
      if (tokenService) {
        setTokenServices(prev => {
          const newMap = new Map(prev);
          newMap.set(tokenAddress, tokenService);
          return newMap;
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Error adding token service for ${tokenAddress}:`, err);
      return false;
    }
  };

  // Initialize all contract services
  useEffect(() => {
    const initServices = async () => {
      if (!provider || !isConnected || !account) {
        setIsInitialized(false);
        setInvoiceNFTService(null);
        setLendingMarketplaceService(null);
        setTokenServices(new Map());
        return;
      }

      try {
        setIsInitializing(true);
        setError(null);

        // Initialize InvoiceNFT service
        const nftService = new InvoiceNFTService(provider);
        await nftService.init();
        setInvoiceNFTService(nftService);

        // Initialize LendingMarketplace service
        const marketplaceService = new LendingMarketplaceService(provider);
        await marketplaceService.init();
        setLendingMarketplaceService(marketplaceService);

        // Initialize token services
        const supportedTokens = getSupportedTokens();
        const tokenServicesMap = new Map();
        
        for (const tokenAddress of supportedTokens) {
          const tokenService = await initTokenService(tokenAddress);
          if (tokenService) {
            tokenServicesMap.set(tokenAddress, tokenService);
          }
        }
        
        setTokenServices(tokenServicesMap);
        setIsInitialized(true);
      } catch (err) {
        setError(`Error initializing services: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsInitializing(false);
      }
    };

    initServices();
  }, [provider, isConnected, account]);

  return {
    invoiceNFTService,
    lendingMarketplaceService,
    tokenServices,
    isInitialized,
    isInitializing,
    error,
    currentAccount: account,
    addTokenService
  };
}; 