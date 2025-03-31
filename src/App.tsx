import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MetaMaskProvider } from '@metamask/sdk-react';
import { ApolloProvider } from '@apollo/client';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MintInvoice } from './pages/MintInvoice';
import { Marketplace } from './pages/Marketplace';
import { Dashboard } from './pages/Dashboard';

import { HowItWorks } from './pages/HowItWorks';
import { OfferLoan } from './pages/OfferLoan';
import { Web3Provider } from './context/Web3Context';
import { client } from './lib/apollo';
import InvoiceDetailPage from './pages/InvoiceDetailPage';

function App() {

  
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "NFTInvoice",
          url: window.location.href,
        },
      }}
    >
      <Web3Provider>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="mint" element={<MintInvoice />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="Invoice-details/:tokenId" element={<InvoiceDetailPage/>} />
              {  <Route path="dashboard" element={<Dashboard />} />}
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="offer-loan" element={<OfferLoan />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ApolloProvider>
      </Web3Provider>
    </MetaMaskProvider>
  );
}

export default App;