import React from 'react';
import { OfferLoanForm } from '../components/OfferLoanForm';

export function OfferLoan() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Offer a Loan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn interest by providing liquidity to invoice owners. Select an invoice ID and enter the amount you'd like to lend.
        </p>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <OfferLoanForm />
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">How it works</h3>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-500">
                  1
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Select an Invoice</h4>
                <p className="text-sm text-gray-500">Enter the ID of the invoice you'd like to fund.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-500">
                  2
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Specify Loan Terms</h4>
                <p className="text-sm text-gray-500">Enter the amount you're willing to lend and select a token.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-500">
                  3
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Approve & Submit</h4>
                <p className="text-sm text-gray-500">Approve the token spending and complete the loan offer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 