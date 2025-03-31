import React, { useState } from 'react';
import { useContractService } from '../hooks/useContractService';

export function ListInvoiceForm() {
  const { contractService, isInitialized, isInitializing, error, contractAddresses } = useContractService();
  const [tokenId, setTokenId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState('');
  const [listingDetails, setListingDetails] = useState<{
    invoiceId: number;
    newOwner: string;
    loanStatus: boolean;
    riskFactor: number;
  } | null>(null);

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractService || !isInitialized) {
      setTxError('Contract service not initialized');
      return;
    }
    
    if (!tokenId || !dueDate) {
      setTxError('Please enter all fields');
      return;
    }
    
    try {
      // First, approve the marketplace to transfer the NFT
      setIsApproving(true);
      setTxError('');
      setTxHash('');
      setListingDetails(null);
      
      const tokenIdNum = parseInt(tokenId);
      const dueDateTimestamp = Math.floor(new Date(dueDate).getTime() / 1000);
      
      await contractService.approveNFT(
        contractAddresses.LENDING_MARKETPLACE,
        tokenIdNum
      );
      
      setIsApproving(false);
      setIsLoading(true);
      
      // Then, list the invoice for a loan
      const receipt = await contractService.listInvoiceForLoan(
        tokenIdNum,
        dueDateTimestamp
      );
      
      setTxHash(receipt.hash);
      
      // For demonstration, we use the token ID as the invoice ID
      // In a real app, you would get this from the transaction logs
      const invoiceId = tokenIdNum;
      
      // Get the new owner and loan details
      const newOwner = await contractService.getOwnerOf(tokenIdNum);
      const loan = await contractService.getLoan(invoiceId);
      const riskFactor = await contractService.getRiskFactor(invoiceId);
      
      setListingDetails({
        invoiceId,
        newOwner,
        loanStatus: loan.isActive,
        riskFactor
      });
      
      // Reset the form
      setTokenId('');
      setDueDate('');
    } catch (err) {
      console.error('Error listing invoice:', err);
      setTxError(`Error listing invoice: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
      setIsApproving(false);
    }
  };
  
  // Get tomorrow's date as a minimum date for the due date input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  return (
    <div className="mt-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">List Invoice for Loan</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleList} className="space-y-4">
        <div>
          <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">
            Invoice NFT ID
          </label>
          <input
            type="number"
            id="tokenId"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="e.g., 1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading || isApproving || isInitializing || !isInitialized}
            min="1"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading || isApproving || isInitializing || !isInitialized}
            min={minDate}
            required
          />
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
            {isLoading ? 'Listing...' : isApproving ? 'Approving...' : isInitializing ? 'Initializing...' : 'List Invoice for Loan'}
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
      
      {listingDetails && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <h3 className="font-semibold text-lg mb-2">Listing Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Invoice ID:</span> {listingDetails.invoiceId}</p>
            <p><span className="font-medium">New Owner (Marketplace):</span> {listingDetails.newOwner.slice(0, 8)}...{listingDetails.newOwner.slice(-6)}</p>
            <p><span className="font-medium">Loan Status:</span> {listingDetails.loanStatus ? 'Active' : 'Pending'}</p>
            <p><span className="font-medium">Risk Factor:</span> {listingDetails.riskFactor}</p>
          </div>
        </div>
      )}
    </div>
  );
} 