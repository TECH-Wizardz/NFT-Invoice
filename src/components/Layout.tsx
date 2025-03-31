import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ConnectWallet } from './ConnectWallet';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar>
        <ConnectWallet />
      </Navbar>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}