import React from 'react';
import { useWeb3 } from '../context/Web3Context';

export function ConnectWallet() {
  const { account, connect, disconnect, isConnected } = useWeb3();

  return (
    <div className="flex items-center space-x-4">
      {account ? (
        <>
          <span className="text-sm text-gray-600">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connect}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
} 