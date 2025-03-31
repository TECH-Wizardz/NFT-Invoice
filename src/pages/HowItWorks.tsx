import React from 'react';
import { FileText, Wallet, PiggyBank, ArrowRight, Shield, BarChart as ChartBar, Clock, Check, DollarSign } from 'lucide-react';

export function HowItWorks() {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            How Invoice Financing Works
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Turn your outstanding invoices into immediate cash flow with our simple, 
            transparent, and secure digital process
          </p>
        </div>

        {/* For Businesses Section */}
        <div className="mt-20">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-2 bg-indigo-100 rounded-full text-lg font-semibold text-indigo-800">
                For Businesses Seeking Funding
              </span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-8">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full text-lg font-bold">
                  1
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 mt-4">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Upload Your Invoice</h3>
              <p className="mt-4 text-gray-600 text-base leading-relaxed">
                Complete our straightforward digital form with your invoice details. 
                Include information about your customer, invoice amount, and due date. 
                The system verifies this information in minutes, not days.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Simple upload process takes less than 5 minutes
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Works with most invoice formats and accounting systems
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-8">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full text-lg font-bold">
                  2
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 mt-4">
                <Wallet className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Convert to Digital Asset</h3>
              <p className="mt-4 text-gray-600 text-base leading-relaxed">
                Your verified invoice is transformed into a secure digital asset on our platform. 
                This conversion preserves all the legal rights of the original invoice while making 
                it immediately financeable.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Maintains legal enforceability of your invoice
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Bank-level security protects your data
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-8">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full text-lg font-bold">
                  3
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 mt-4">
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Receive Immediate Funding</h3>
              <p className="mt-4 text-gray-600 text-base leading-relaxed">
                Lenders on our platform review your invoice and provide competitive financing offers. 
                Select the best terms for your business, and receive funds directly to your bank account, 
                typically within 24 hours.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Funds typically arrive within 24 hours
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Transparent fee structure with no hidden costs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* For Lenders Section */}
        <div className="mt-24">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-2 bg-green-100 rounded-full text-lg font-semibold text-green-800">
                For Lenders Providing Capital
              </span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-8">
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full text-lg font-bold">
                  1
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mt-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Review Verified Invoices</h3>
              <p className="mt-4 text-gray-600 text-base leading-relaxed">
                Browse through pre-vetted invoice opportunities on our secure marketplace. 
                Each listing includes detailed information about the business, their customer, 
                and a comprehensive risk assessment.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    All invoices are pre-verified for authenticity
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Detailed risk metrics and business profiles
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-8">
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full text-lg font-bold">
                  2
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mt-4">
                <PiggyBank className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Fund Selected Invoices</h3>
              <p className="mt-4 text-gray-600 text-base leading-relaxed">
                Choose which invoices to finance based on your risk appetite and return requirements. 
                Submit your funding offer with your preferred advance rate and fee structure.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Set your own terms and advance rates
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Direct connection with businesses seeking capital
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-8">
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full text-lg font-bold">
                  3
                </div>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mt-4">
                <ChartBar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Collect Returns</h3>
              <p className="mt-4 text-gray-600 text-base leading-relaxed">
                When the invoice payment date arrives, the original customer pays the invoice amount. 
                You automatically receive your principal plus agreed-upon fees, 
                typically providing attractive returns on short-term funding.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Automated repayment when invoice is paid
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">
                    Typical financing periods of 30-90 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Banner */}
        <div className="mt-24 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl">
          <div className="px-8 py-12 sm:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-3 lg:gap-x-8">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center lg:justify-start">
                  <Clock className="h-10 w-10 text-indigo-100" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Fast Processing</h3>
                <p className="mt-2 text-indigo-100">
                  Get funded within 24 hours rather than waiting weeks for traditional financing
                </p>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center lg:justify-start">
                  <Shield className="h-10 w-10 text-indigo-100" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Secure & Transparent</h3>
                <p className="mt-2 text-indigo-100">
                  All transactions are protected with bank-level security and transparent terms
                </p>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center lg:justify-start">
                  <ChartBar className="h-10 w-10 text-indigo-100" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Mutual Benefits</h3>
                <p className="mt-2 text-indigo-100">
                  Businesses get immediate cash flow while lenders earn attractive returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}