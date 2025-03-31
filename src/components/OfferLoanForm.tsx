import React, { useState } from 'react';
import { formatUnits } from 'ethers';
import { useContractService } from '../hooks/useContractService';

export function OfferLoanForm() {
  const { contractService, isInitialized, isInitializing, error, contractAddresses, currentAccount } = useContractService();
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState('');
  const [offerDetails, setOfferDetails] = useState<{
    invoiceId: number;
    lenderBalance: string;
    marketplaceBalance: string;
  } | null>(null);

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractService || !isInitialized) {
      setTxError('Contract service not initialized');
      return;
    }
    
    if (!invoiceId || !amount || !selectedToken) {
      setTxError('Please enter all fields');
      return;
    }
    
    try {
      setIsApproving(true);
      setTxError('');
      setTxHash('');
      setOfferDetails(null);
      
      const invoiceIdNum = parseInt(invoiceId);
      // Convert amount to token units (assuming 6 decimals)
      const amountInTokenUnits = contractService.formatTokenAmount(parseFloat(amount));
      
      // First, approve the marketplace to spend tokens
      await contractService.approveToken(
        selectedToken,
        contractAddresses.LENDING_MARKETPLACE,
        amountInTokenUnits.toString() // Convert to string to avoid type issues
      );
      
      setIsApproving(false);
      setIsLoading(true);
      
      // Then, offer the loan
      const receipt = await contractService.offerLoan(
        invoiceIdNum,
        selectedToken,
        amountInTokenUnits.toString() // Convert to string to avoid type issues
      );
      
      setTxHash(receipt.hash);
      
      // Get the lender's balance after the offer
      if (currentAccount) {
        const lenderBalance = await contractService.getTokenBalance(selectedToken, currentAccount);
        const marketplaceBalance = await contractService.getTokenBalance(
          selectedToken,
          contractAddresses.LENDING_MARKETPLACE
        );
        
        setOfferDetails({
          invoiceId: invoiceIdNum,
          lenderBalance: formatUnits(lenderBalance, 6),
          marketplaceBalance: formatUnits(marketplaceBalance, 6)
        });
      }
      
      // Reset the form
      setInvoiceId('');
      setAmount('');
    } catch (err) {
      console.error('Error offering loan:', err);
      setTxError(`Error offering loan: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
      setIsApproving(false);
    }
  };
  
  // Available tokens
  const tokens = [
    { address: contractAddresses.MOCK_USDC, name: 'USDC', symbol: 'USDC' },
    { address: contractAddresses.MOCK_USDT, name: 'USDT', symbol: 'USDT' }
  ];
  
  return (
    <div className="mt-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Offer Loan</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleOffer} className="space-y-4">
        <div>
          <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700">
            Invoice ID
          </label>
          <input
            type="number"
            id="invoiceId"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            placeholder="e.g., 1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading || isApproving || isInitializing || !isInitialized}
            min="1"
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Loan Amount
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 8000"
              className="flex-1 min-w-0 block w-full border border-r-0 border-gray-300 rounded-l-md p-2"
              disabled={isLoading || isApproving || isInitializing || !isInitialized}
              min="1"
              step="0.01"
              required
            />
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md"
              disabled={isLoading || isApproving || isInitializing || !isInitialized}
              required
            >
              <option value="">Select</option>
              {tokens.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading || isApproving || isInitializing || !isInitialized
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            disabled={isLoading || isApproving || isInitializing || !isInitialized}
          >
            {isLoading ? 'Offering Loan...' : isApproving ? 'Approving Token Spend...' : isInitializing ? 'Initializing...' : 'Offer Loan'}
          </button>
        </div>
      </form>
      
      {txError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {txError}
        </div>
      )}
      
      {txHash && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Transaction successful!</p>
          <p className="text-xs mt-1 break-all">
            Transaction Hash: {txHash}
          </p>
        </div>
      )}
      
      {offerDetails && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <h3 className="font-semibold text-lg mb-2">Offer Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Invoice ID:</span> {offerDetails.invoiceId}</p>
            <p><span className="font-medium">Your Balance:</span> {offerDetails.lenderBalance} {tokens.find(t => t.address === selectedToken)?.symbol}</p>
            <p><span className="font-medium">Marketplace Balance:</span> {offerDetails.marketplaceBalance} {tokens.find(t => t.address === selectedToken)?.symbol}</p>
          </div>
        </div>
      )}
    </div>
  );
} 