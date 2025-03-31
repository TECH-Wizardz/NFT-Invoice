// InvoiceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  DollarSign, 
  Calendar, 
  User, 
  FileText, 
  Tag, 
  Clock, 
  Shield,
  Download 
} from 'lucide-react';
import { useQuery } from "@apollo/client";
import { GET_INVOICE_BY_ID } from '../graphql/query';
import { usePinata } from '../hooks/usePinata';
import MakeOfferForm from '../components/OfferForm';
import { GET_INVOICE_MINTED_BY_TOKEN_ID } from '../graphql/qurey';

const InvoiceDetailPage = () => {
  const { tokenId } = useParams();
  const { getFile } = usePinata();
  const [invoice, setInvoice] = useState(null);
  const [ipfsData, setIpfsData] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch minted invoice data from GraphQL
  const { data: mintedInvoiceData, loading: mintedInvoiceLoading } = useQuery(GET_INVOICE_MINTED_BY_TOKEN_ID, {
    variables: { tokenId: Number(tokenId) },
    onCompleted: async (data) => {
      console.log('MINTED INVOICE DATA:', data);
      // Check if we have invoiceMinted OR invoiceMinteds array
      const mintedInvoice = data?.invoiceMinted || 
                          (data?.invoiceMinteds && data.invoiceMinteds.length > 0 ? 
                           data.invoiceMinteds[0] : null);
      
      if (mintedInvoice) {
        // Process the minted invoice data
        const baseInvoice = {
          id: mintedInvoice.id,
          tokenId: mintedInvoice.tokenId,
          owner: mintedInvoice.owner,
          ipfsCID: mintedInvoice.ipfsCID,
          transactionHash: mintedInvoice.transactionHash,
          blockTimestamp: mintedInvoice.blockTimestamp,
          // These fields will be populated from IPFS data later
          amount: 0,
          dueDate: new Date(),
          issueDate: new Date(parseInt(mintedInvoice.blockTimestamp) * 1000),
          payerName: '',
          status: 'Listed',
          description: '',
          invoiceNumber: mintedInvoice.tokenId
        };
        
        setInvoice(baseInvoice);
        
        // Fetch IPFS data immediately after setting the invoice
        try {
          const ipfsData = await getFile(mintedInvoice.ipfsCID);
          setIpfsData(ipfsData);
          
          if (ipfsData) {
            setInvoice(prev => ({
              ...prev,
              amount: parseFloat(ipfsData.attributes?.amount || 0),
              dueDate: new Date(ipfsData.attributes?.dueDate || Date.now()),
              payerName: ipfsData.attributes?.payerName || 'Unknown',
              description: ipfsData.description || '',
              invoiceNumber: ipfsData.name?.replace('Invoice #', '') || prev.tokenId,
              image: ipfsData.image || ''
            }));
          }
        } catch (error) {
          console.error("Error fetching IPFS data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // No invoice data found
        console.error("No invoice data found for token ID:", tokenId);
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Error fetching invoice data:", error);
      setLoading(false);
    }
  });

  // Set loading to false if query finishes but no data
  useEffect(() => {
    if (!mintedInvoiceLoading && !mintedInvoiceData) {
      setLoading(false);
    }
  }, [mintedInvoiceLoading, mintedInvoiceData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-indigo-600">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
          <p className="text-gray-600 mb-6">The invoice with token ID #{tokenId} could not be found.</p>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Invoice Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Invoice #{invoice.invoiceNumber}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {invoice.status}
            </span>
          </div>
        </div>
        
        {/* Invoice Content */}
        <div className="p-6">
          {/* Top Section - Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-gray-900">${invoice.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-lg font-medium text-gray-900">{invoice.dueDate.toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="text-lg font-medium text-gray-900">{invoice.issueDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Payer</p>
                  <p className="text-lg font-medium text-gray-900">{invoice.payerName}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Token ID</p>
                  <p className="text-lg font-medium text-gray-900">#{invoice.tokenId}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FileText className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">IPFS CID</p>
                  <p className="text-lg font-medium text-gray-900 truncate max-w-xs">
                    {invoice.ipfsCID}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{invoice.description || "No description available."}</p>
          </div>
          
          {/* Invoice Image */}
          {invoice.image && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Invoice Document</h2>
              <div className="mt-3 border border-gray-200 rounded-lg p-4">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img 
                    src={invoice.image} 
                    alt="Invoice document" 
                    className="rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-invoice-document.png';
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <a 
                  href={invoice.image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-5 w-5 mr-2 text-gray-500" />
                  View Full Document
                </a>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Make Loan Offer
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
      
      {/* Make Offer Form */}
      {showOfferForm && (
        <div className="mt-8">
          <MakeOfferForm 
            invoice={invoice} 
            onClose={() => setShowOfferForm(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailPage;