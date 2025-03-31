import React from 'react';
import { FileText, Wallet, Shield, BarChart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="relative isolate bg-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 mb-6">
            Fast, Secure, Digital
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Turn Your Invoices Into Immediate Cash Flow
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Say goodbye to 30-90 day payment delays. Get paid today for your outstanding invoices through our secure digital platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/marketplace"
              className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            Go to Market
            </Link>
            <Link
             to = "/how-it-works"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              See How It Works <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mx-auto mt-20 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Simple Solutions for Both Sides of Invoice Finance
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* For Businesses with Invoices */}
            <div className="relative rounded-2xl border border-gray-200 p-8 bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-8 tracking-tight text-gray-900">
                For Businesses With Invoices
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="flex gap-x-3">
                  <Clock className="h-5 w-5 flex-none text-indigo-600" />
                  <span className="text-base text-gray-700">Get paid in 24 hours instead of waiting 30-90 days</span>
                </li>
                <li className="flex gap-x-3">
                  <Shield className="h-5 w-5 flex-none text-indigo-600" />
                  <span className="text-base text-gray-700">Secure, digital process with transparent fees</span>
                </li>
                <li className="flex gap-x-3">
                  <BarChart className="h-5 w-5 flex-none text-indigo-600" />
                  <span className="text-base text-gray-700">Improve cash flow without traditional loans</span>
                </li>
              </ul>
            </div>

            {/* For Lenders */}
            <div className="relative rounded-2xl border border-gray-200 p-8 bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-8 tracking-tight text-gray-900">
                For Lenders
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="flex gap-x-3">
                  <BarChart className="h-5 w-5 flex-none text-emerald-600" />
                  <span className="text-base text-gray-700">Earn attractive returns on verified business invoices</span>
                </li>
                <li className="flex gap-x-3">
                  <Shield className="h-5 w-5 flex-none text-emerald-600" />
                  <span className="text-base text-gray-700">All invoices are verified and secured as digital assets</span>
                </li>
                <li className="flex gap-x-3">
                  <Clock className="h-5 w-5 flex-none text-emerald-600" />
                  <span className="text-base text-gray-700">Short investment cycles with predictable returns</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works - Brief Overview */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              The Simplest Way to Finance Invoices
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our digital platform makes invoice financing accessible to everyone
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Upload Invoice</h3>
              <p className="mt-2 text-base text-gray-600">
                Securely upload your invoice to our platform in minutes
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Get Verified</h3>
              <p className="mt-2 text-base text-gray-600">
                Our system quickly verifies your invoice details
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Receive Funds</h3>
              <p className="mt-2 text-base text-gray-600">
                Get paid quickly, typically within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Trust and Security Section */}
        <div className="mx-auto mt-20 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Trusted and Secure
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Your invoices are protected by industry-leading security
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Bank-Level Security</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your data is protected with the same encryption used by major banks
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Verified Businesses</h3>
              <p className="mt-2 text-sm text-gray-600">
                All participants undergo thorough verification before joining
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Transparent Process</h3>
              <p className="mt-2 text-sm text-gray-600">
                Clear terms and fees with no hidden charges or surprises
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Digital Contracts</h3>
              <p className="mt-2 text-sm text-gray-600">
                Legally binding digital agreements that protect all parties
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section - Brief */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">What is invoice financing?</h3>
              <p className="mt-2 text-base text-gray-600">
                Invoice financing lets businesses receive immediate payment for their outstanding invoices instead of waiting 30-90 days for customers to pay, improving cash flow and business operations.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">How quickly can I get funded?</h3>
              <p className="mt-2 text-base text-gray-600">
                Most businesses receive funding within 24 hours after their invoice is verified on our platform. The entire process is digital and streamlined for speed.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Is my invoice information secure?</h3>
              <p className="mt-2 text-base text-gray-600">
                Yes, we use bank-level encryption and security protocols to protect all data on our platform. Your information is kept confidential and secure at all times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}