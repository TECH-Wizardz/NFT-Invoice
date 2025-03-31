import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const LoanList = ({ 
  lenderLoans, 
  borrowerLoans, 
  lenderLoading, 
  borrowerLoading, 
  lenderError, 
  borrowerError, 
  loanTab, 
  handleRepayLoan, 
  handleClaimDefault 
}) => {
  // Transform and combine loans
  const { account } = useWeb3();
  const currentLoans = useMemo(() => {
    // Combine and transform lender and borrower loans
   
    const transformLoans = (loans, type) => {
      return (loans?.invoices || []).map(loan => ({
        id: loan.id,
        tokenId: loan.tokenId,
        amount: parseFloat(loan.loanAmount),
        tokenType: 'USDC', // Adjust based on your token type
        dueDate: new Date(parseInt(loan.dueDate) * 1000), // Convert timestamp to Date
        interest: parseFloat(loan.interest),
        createdAt: new Date(parseInt(loan.createdAt) * 1000),
        lender: type === 'lender' ? account : loan.lender?.id,
        borrower: type === 'borrowed' ? account : loan.borrower?.id
      }));
    };

    const lenderTransformedLoans = transformLoans(lenderLoans, 'lender');
    const borrowerTransformedLoans = transformLoans(borrowerLoans, 'borrowed');

    // Filter based on current loan tab
    return loanTab === 'lent' ? lenderTransformedLoans : borrowerTransformedLoans;
  }, [lenderLoans, borrowerLoans, loanTab]);

  // Loading and error handling
  if (lenderLoading || borrowerLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading loans...
      </div>
    );
  }

  if (lenderError || borrowerError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading loans. Please try again.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {currentLoans.length > 0 ? (
        currentLoans.map((loan) => {
          // Calculate days remaining
          const today = new Date();
          const diffTime = loan.dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isOverdue = diffDays < 0;
          
          return (
            <div key={loan.id} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-md">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`rounded-full p-2.5 ${isOverdue ? 'bg-red-100' : 'bg-green-100'}`}>
                    <Clock className={`h-5 w-5 ${isOverdue ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {loan.amount.toLocaleString()} {loan.tokenType}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {loanTab === 'borrowed' ? 
                      <span>Lender: {loan.lender}</span> : 
                      <span>Borrower: {loan.borrower}</span>
                    }
                    <span className="mx-1.5">•</span>
                    <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                      {isOverdue 
                        ? `Overdue by ${Math.abs(diffDays)} days` 
                        : `${diffDays} days remaining`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {loanTab === 'borrowed' ? (
                  <button 
                    className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100"
                    onClick={() => handleRepayLoan(loan)}
                  >
                    Repay
                  </button>
                ) : isOverdue && (
                  <button 
                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100"
                    onClick={() => handleClaimDefault(loan)}
                  >
                    Claim Default
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-8 text-center text-gray-500">
          You don't have any {loanTab} loans at the moment.
        </div>
      )}
    </div>
  );
};

export default LoanList;