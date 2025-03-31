import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const location = useLocation();
const { account, connect, disconnect } = useWeb3(); 
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">NFTInvoice</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
        
              <Link
                to="/marketplace"
                className={`${
                  location.pathname === '/marketplace'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Marketplace
              </Link>
       { account&&
              <Link
                to="/dashboard"
                className={`${
                  location.pathname === '/dashboard'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
      }
              <Link
                to="/how-it-works"
                className={`${
                  location.pathname === '/how-it-works'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {children}
          </div>
        </div>
      </div>
    </nav>
  );
} 