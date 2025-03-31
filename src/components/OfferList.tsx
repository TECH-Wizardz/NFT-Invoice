import React, { useMemo } from 'react';
import { UserPlus, Check, Trash } from 'lucide-react';

// Utility function to get status color and label
const getStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return { 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100', 
        label: 'Pending' 
      };
    case 'ACCEPTED':
      return { 
        color: 'text-green-600', 
        bgColor: 'bg-green-100', 
        label: 'Accepted' 
      };
    case 'REJECTED':
      return { 
        color: 'text-red-600', 
        bgColor: 'bg-red-100', 
        label: 'Rejected' 
      };
    case 'CANCELLED':
      return { 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-100', 
        label: 'Cancelled' 
      };
    default:
      return { 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-100', 
        label: status || 'Unknown' 
      };
  }
};

const OffersList = ({ 
  offerData, 
  offerSentData, 
  offerLoading, 
  sentLoading, 
  offerError, 
  sentError, 
  offerTab, 
  handleAcceptOffer, 
  handleCancelOffer 
}) => {
    console.log('offerData:', offerData);
  // Transform and combine offers
  const processedOffers = useMemo(() => {
    // Transform received offers
    const transformReceivedOffers = (data) => {
      return (data?.offers || []).map(offer => ({
        id: offer.id,
        tokenId: offer.invoice.id,
        amount: parseFloat(offer.amount),
        lender: offer.lender?.id,
        borrower: offer.invoice?.borrower?.id,
        interest: parseFloat(offer.interest),
        status: offer.status,
        createdAt: new Date(parseInt(offer.createdAt) * 1000),
        invoiceId: offer.invoice?.id,
        dueDate: new Date(parseInt(offer.invoice?.dueDate) * 1000)
      }));
    };

    // Transform sent offers
    const transformSentOffers = (data) => {
      return (data?.offers || []).map(offer => ({
        id: offer.id,
        tokenId: offer.invoice.id,
        amount: parseFloat(offer.amount),
    
        lender: offer.lender?.id,
        borrower: offer.invoice?.borrower?.id,
        interest: parseFloat(offer.interest),
        status: offer.status,
        createdAt: new Date(parseInt(offer.createdAt) * 1000),
        invoiceId: offer.invoice?.id,
        dueDate: new Date(parseInt(offer.invoice?.dueDate) * 1000)
      }));
    };

    // Determine which offers to show based on offerTab
    if (offerTab === 'received') {
      return transformReceivedOffers(offerData);
    } else if (offerTab === 'yours') {
      return transformSentOffers(offerSentData);
    }

    return [];
  }, [offerData, offerSentData, offerTab]);

  // Loading and error handling
  if (offerLoading || sentLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading offers...
      </div>
    );
  }

  if (offerError || sentError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading offers. Please try again.
      </div>
    );
  }

  // Count pending offers for received tab
  const pendingOffersCount = offerTab === 'received' 
    ? processedOffers.filter(offer => offer.status === 'PENDING').length 
    : 0;

  return (
    <div>
      {offerTab === 'received' && pendingOffersCount > 1 && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
          <p>Note: Once you accept an offer, all other pending offers will be automatically rejected.</p>
        </div>
      )}
      
      <div className="divide-y divide-gray-100">
        {processedOffers.length > 0 ? (
          processedOffers.map((offer) => {
            const isReceivedTab = offerTab === 'received';
            const statusStyle = getStatusStyle(offer.status);
            
            return (
              <div key={offer.id} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`rounded-full p-2.5 ${isReceivedTab ? 'bg-blue-50' : 'bg-indigo-50'}`}>
                      <UserPlus className={`h-5 w-5 ${isReceivedTab ? 'text-blue-500' : 'text-indigo-500'}`} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-medium text-gray-900">
                        {offer.amount.toLocaleString()} {offer.tokenType}
                      </h3>
                      <span 
                        className={`px-2 py-0.5 rounded-full text-xs ${statusStyle.bgColor} ${statusStyle.color}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {isReceivedTab ? (
                        <span>From: {offer.lender}</span>
                      ) : (
                        <span>To: {offer.borrower}</span>
                      )}
                      <span className="mx-1.5">•</span>
                      <span>{offer.interest}% interest</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {isReceivedTab && offer.status === 'PENDING' ? (
                    <button 
                      className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                      onClick={() => handleAcceptOffer(offer)}
                      title="Accept Offer"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  ) : offer.status === 'PENDING' && (
                    <button 
                      className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                      onClick={() => handleCancelOffer(offer)}
                      title="Cancel Offer"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            {offerTab === 'received' 
              ? 'No offers received yet for your listed invoices.'
              : 'You haven\'t made any offers yet.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersList;