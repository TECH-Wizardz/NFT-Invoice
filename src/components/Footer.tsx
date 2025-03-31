import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Disc as Discord } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-indigo-600">NFTInvoice</h3>
            <p className="text-gray-500 text-sm">
              Transforming invoice financing through blockchain technology and decentralized finance.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-gray-400 hover:text-gray-500">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://discord.com" className="text-gray-400 hover:text-gray-500">
                <Discord className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/marketplace" className="text-gray-500 hover:text-gray-900">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/pools" className="text-gray-500 hover:text-gray-900">
                  Investment Pools
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-500 hover:text-gray-900">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/documentation" className="text-gray-500 hover:text-gray-900">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-500 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900">
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-gray-500 hover:text-gray-900">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} NFTInvoice. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}