import React, { useState , useEffect } from 'react';
import { Search, Filter, AlertCircle, DollarSign, Calendar, UserCheck, ArrowUpDown } from 'lucide-react';
import { useQuery } from "@apollo/client";
import {  GET_LISTED_INVOICE_TOKEN_IDS,  GET_MINTED_INVOICES_BY_TOKEN_IDS} from '../graphql/qurey';

import InvoiceCard from '../components/InvoiceCard';
export function Marketplace() {
  const [allInvoices, setAllInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  // Step 1: Fetch Listed Invoices' Token IDs
  const { data: listedData, loading: listedLoading } = useQuery(GET_LISTED_INVOICE_TOKEN_IDS, {
    variables: { payerName: searchTerm },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.invoices) {
        const ids = data.invoices.map((invoice) => Number(invoice.tokenId));
        setTokenIds(ids);
      }
    },
  });

  
  // Step 2: Fetch Minted Invoices based on Token IDs
  const { data: mintedData, loading: mintedLoading } = useQuery(GET_MINTED_INVOICES_BY_TOKEN_IDS, {
    variables: { tokenIds },
    skip: tokenIds.length === 0, // Skip query if tokenIds is empty
        fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('Minted Data:', data);
  }});



  useEffect(() => {
    const processInvoiceData = async () => {
      if (mintedData?.invoiceMinteds && mintedData.invoiceMinteds.length > 0) {
        const processedInvoices = await Promise.all(
          mintedData.invoiceMinteds.map(async (invoice) => {
            return {
              id: invoice.id,
              tokenId: invoice.tokenId,
              owner: invoice.owner,
              ipfsCID: invoice.ipfsCID,
              transactionHash: invoice.transactionHash
            };
          })
        );
        
        setAllInvoices(processedInvoices);
      }
    };
    
    if (!mintedLoading && mintedData) {
      processInvoiceData();
    }
  }, [mintedData, mintedLoading]);

  return (
    <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Invoice Marketplace</h1>
      
      {/* Improved search and filter section */}
      <div className="w-full md:max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search invoices by payer name..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-base shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <span className="text-xl font-medium">&times;</span>
            </button>
          )}
        </div>
        
        {/* Optional search hint */}
        {searchTerm && (
          <p className="text-xs text-gray-500 mt-1 ml-2">
            Searching for payers named "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allInvoices.length > 0 ? (
        allInvoices.map((invoice) => (
          <InvoiceCard key={invoice.tokenId} invoice={invoice} />
        ))
      ) : (
        <div className="col-span-3 text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
         
          <p className="mt-1 text-sm text-gray-500">
            {mintedLoading || listedLoading 
              ? "Loading invoices..." 
              : searchTerm 
                ? `No invoices found with payer name containing "${searchTerm}"`
                : "There are no invoices currently listed in the marketplace."
            }
          </p>
        </div>
      )}
    </div>
  </div>
  );
}