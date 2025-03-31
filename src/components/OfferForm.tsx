// MakeOfferForm.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, Check } from 'lucide-react';
import { useContractService } from '../hooks/useContractService';
import { message } from 'antd';

const MakeOfferForm = ({ invoice, onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState({ value: import.meta.env.VITE_SUPPORTED_TOKENS, label: 'MUSDC' });
  const [interest, setInterest] = useState('');
  const [loanAmount, setLoanAmount] = useState(invoice.amount);
  const [totalRepayment, setTotalRepayment] = useState(invoice.amount);
  const { lendingMarketplaceService, isInitialized, isInitializing, error } = useContractService();

  const currencyOptions = [
    { value: import.meta.env.VITE_SUPPORTED_TOKENS, label: 'MUSDC' }
  ];
  
  // Calculate total repayment when interest changes
  useEffect(() => {
    if (interest && !isNaN(interest) && parseInt(interest) > 0) {
      const interestAmount = (invoice.amount * parseInt(interest)) / 100;
      setTotalRepayment(invoice.amount + interestAmount);
    } else {
      setTotalRepayment(invoice.amount);
    }
  }, [interest, invoice.amount]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if(!isInitialized || !lendingMarketplaceService) {
        message.error('Contract not connected')
        console.error('LendingMarketplaceService not initialized');
        return;
    }

  try{
    await lendingMarketplaceService.offerLoan(invoice.tokenId, selectedCurrency.value, loanAmount, parseInt(interest));
    message.success('Offer submitted successfully');

  }catch(err)
  {

    message.error('Error submitting offer');
    console.error('Error submitting offer:', err);
  }

    

    // Submit offer logic here
    console.log({
      invoiceId: invoice.id,
      currency: selectedCurrency.value,
      interest: parseInt(interest),
      loanAmount,
      totalRepayment
    });
    
    // Show success and close
  

  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Make Loan Offer</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Invoice Preview */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Invoice Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-lg font-medium text-gray-900">${invoice.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="text-lg font-medium text-gray-900">{invoice.dueDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payer</p>
              <p className="text-lg font-medium text-gray-900">{invoice.payerName}</p>
            </div>
          </div>
        </div>
        
        {/* Form Controls */}
        <div className="space-y-4">
          {/* Currency Selection */}
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              value={selectedCurrency.value}
              onChange={(e) => {
                const option = currencyOptions.find(opt => opt.value === e.target.value);
                setSelectedCurrency(option || currencyOptions[0]);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {/* Interest Rate */}
          <div>
            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                id="interest"
                value={interest}
                onChange={(e) => {
                  // Only allow integer values
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setInterest(value);
                  }
                }}
                onBlur={() => {
                  // Convert to integer on blur if needed
                  if (interest && interest.includes('.')) {
                    setInterest(Math.floor(parseFloat(interest)).toString());
                  }
                }}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview Calculation */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-900 mb-3">Offer Preview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Loan Amount:</span>
              <span className="font-medium">{selectedCurrency.label} {loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Interest ({interest || 0}%):</span>
              <span className="font-medium">{selectedCurrency.label} {(totalRepayment - loanAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-indigo-200">
              <span className="text-indigo-800">Total Repayment:</span>
              <span className="text-indigo-800">{selectedCurrency.label} {totalRepayment.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="flex items-start space-x-2 text-sm text-gray-500">
          <AlertCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p>
            By submitting this offer, you agree to provide a loan against this invoice. 
            The loan will be repaid when the invoice is paid, or on the due date, whichever comes first.
          </p>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Check className="h-4 w-4 mr-2" />
            Submit Offer
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakeOfferForm;