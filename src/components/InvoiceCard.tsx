// InvoiceCard.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, User, Eye, Clock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePinata } from '../hooks/usePinata';

const InvoiceCard = ({ invoice }) => {
  const navigate = useNavigate();
  const { getFile } = usePinata();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (invoice.ipfsCID) {
        try {
          setLoading(true);
          const ipfsData = await getFile(invoice.ipfsCID);
          setInvoiceDetails(ipfsData);
        } catch (error) {
          console.error("Error fetching invoice details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchInvoiceDetails();
  }, []);
  
  const handleViewInvoice = () => {
    navigate(`/Invoice-details/${invoice.tokenId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center h-80 flex items-center justify-center border border-gray-100">
        <div className="space-y-3">
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-indigo-200 rounded-full"></div>
          </div>
          <p className="text-gray-500 font-medium">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return `$${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };



  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">


      {/* Invoice Image Banner */}
      <div className="relative h-40 w-full bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
        {invoiceDetails?.image ? (
          <img 
            src={invoiceDetails.image} 
            alt={invoiceDetails.name || "Invoice preview"} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-invoice.png';
              e.target.onerror = null;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-16 w-16 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
        )}
        
        {/* Invoice ID overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-white text-sm font-medium">
            Invoice #{invoice.tokenId}
          </span>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          {/* Invoice Name */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {invoiceDetails?.name || `Invoice #${invoice.tokenId}`}
          </h3>
          
          {/* Amount Highlight */}
          <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-gray-700 font-medium">Total Amount</span>
            <span className="text-xl font-bold text-indigo-700">
              {formatCurrency(invoiceDetails?.attributes?.amount || invoice.amount)}
            </span>
          </div>
          
          {/* Key Information */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <User className="h-4 w-4 mr-2 text-indigo-500" />
              <span className="font-medium line-clamp-1">
                {invoiceDetails?.attributes?.payerName || invoice.payerName || "Unknown"}
              </span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
              <span>
                Due: {invoiceDetails?.attributes?.dueDate || 
                  (invoice.dueDate ? invoice.dueDate.toLocaleDateString() : "N/A")}
              </span>
            </div>
          </div>
        </div>
        
        {/* View Invoice Button */}
        <button
          onClick={handleViewInvoice}
          className="w-full mt-5 flex items-center justify-center bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;