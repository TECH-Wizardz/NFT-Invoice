import React from 'react';
import { DollarSign } from 'lucide-react';
import { ActiveLoan, Invoice } from '../types';



interface InvoiceListProps {
  invoices: Invoice[];
  loading: boolean;
  handleListForLoan: (invoice: Invoice) => void;
  handleRepayLoan: (loan: ActiveLoan) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices, 
  loading, 
  handleListForLoan, 
  handleRepayLoan 
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading invoices...
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No invoices found with the selected status.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {invoices.map((invoice) => {
      
        const statusText = invoice.status ? 
          invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1).toLowerCase() : 
          'Unknown';
          
      
        let dueDateFormatted = 'N/A';
        if (invoice.dueDate) {
          if (invoice.dueDate instanceof Date) {
            dueDateFormatted = invoice.dueDate.toLocaleDateString();
          } else if (typeof invoice.dueDate === 'string') {
          
            try {
              const date = new Date(parseInt(invoice.dueDate) * 1000);
              dueDateFormatted = date.toLocaleDateString();
            } catch (e) {
              console.error('Error parsing date:', e);
            }
          }
        }
          
     
        const displayAmount = invoice.amount || 
          (invoice.loanAmount ? parseFloat(invoice.loanAmount) : 0);
          
      
        const displayPayerName = invoice.payerName || 'Unknown Payer';
        
        return (
          <div key={invoice.tokenId || invoice.id} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={`rounded-full p-2.5 ${
                  invoice.status === 'minted' ? 'bg-gray-100' :
                  invoice.status === 'listed' ? 'bg-blue-100' :
                  invoice.status === 'funded' || invoice.status === 'LOANED' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  <DollarSign className={`h-5 w-5 ${
                    invoice.status === 'minted' ? 'text-gray-500' :
                    invoice.status === 'listed' ? 'text-blue-500' :
                    invoice.status === 'funded' || invoice.status === 'LOANED' ? 'text-green-500' :
                    'text-purple-500'
                  }`} />
                </div>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">{displayPayerName}</h3>
                <div className="text-sm text-gray-500 flex items-center">
                  <span>${displayAmount.toLocaleString()}</span>
                  <span className="mx-1.5">•</span>
                  <span>Due: {dueDateFormatted}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                invoice.status === 'minted' ? 'bg-gray-100 text-gray-800' :
                invoice.status === 'listed' ? 'bg-blue-100 text-blue-800' :
                invoice.status === 'funded' || invoice.status === 'LOANED' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {statusText}
              </span>
              {invoice.status === 'minted' && (
                <button 
                  className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100"
                  onClick={() => handleListForLoan(invoice)}
                >
                  List for Loan
                </button>
              )}
              {(invoice.status === 'funded' || invoice.status === 'LOANED') && (
                <button 
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100"
                  onClick={() => handleRepayLoan({
                    id: `loan-${invoice.tokenId}`,
                    tokenId: invoice.tokenId,
                    borrower: typeof invoice.borrower === 'object' ? invoice.borrower.id : 
                             typeof invoice.borrower === 'string' ? invoice.borrower : '0xUserAddress',
                    lender: typeof invoice.lender === 'object' ? invoice.lender.id : 
                           typeof invoice.lender === 'string' ? invoice.lender : '0xLenderAddress',
                    amount: displayAmount,
                    tokenType: 'mUSDC',
                    interest: invoice.interest ? parseFloat(invoice.interest) : 5.0,
                    dueDate: invoice.dueDate instanceof Date ? invoice.dueDate : new Date(),
                    status: 'active'
                  })}
                >
                  Repay
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvoiceList;