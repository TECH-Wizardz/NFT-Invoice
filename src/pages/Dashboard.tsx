import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CircleDollarSign, 
  Wallet,
  Plus,
  DollarSign,
  UserPlus,
  CreditCard,
  Filter
} from 'lucide-react';

import { useContractService } from '../hooks/useContractService';
import { usePinata } from '../hooks/usePinata';
import { useQuery } from "@apollo/client";



import { GET_ACTIVE_LOANS, GET_ACTIVE_LOANS_AS_BORROWER, GET_ACTIVE_LOANS_AS_LENDER, GET_DUE_SOON_LOANS, GET_INVOICE_IDS_BY_BORROWER, GET_INVOICES_BY_OWNER, GET_MINTED_INVOICES, GET_TOTAL_BORROWED_AND_LENT_BY_USER, GET_USER_REPUTATION, GET_YOUR_OFFERS_RECEIVED, GET_YOUR_OFFERS_SENT } from '../graphql/qurey';
import { useWeb3 } from '../context/Web3Context';
import LoanList from '../components/LoanList';
import OffersList from '../components/OfferList';
import InvoiceList from '../components/InvoiceList';
import { LendingMarketplaceService } from '../services/LendingMarketplaceService';
import { Invoice } from '../types';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';


interface LoanOffer {
  id: string;
  tokenId: string;
  lender: string;
  borrower?: string; // Added for selected invoice
  amount: number;
  tokenType: string;
  interest: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ActiveLoan {
  id: string;
  tokenId: string;
  borrower: string;
  lender: string;
  amount: number;
  tokenType: string;
  interest: number;
  dueDate: Date;
  status: 'active' | 'overdue' | 'repaid' | 'defaulted';
}

// Navigation section type
interface Section {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}



export function Dashboard() {

  // State management
  const { account } = useWeb3();
  
  // States for navigation and filtering
  const [activeSection, setActiveSection] = useState('my-invoices');
  const [offerTab, setOfferTab] = useState('received');
  const [loanTab, setLoanTab] = useState('borrowed');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  // Mock invoices data
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  
  // API data states
  const [currentDate, setCurrentDate] = useState<string>("0");
  const [threeDaysLater, setThreeDaysLater] = useState<string>("0");
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [totalLent, setTotalLent] = useState(0);
   
  
  
  // Mock offer data
  const [pendingOffers, setPendingOffers] = useState<LoanOffer[]>([
    {
      id: '1',
      tokenId: '0x456',
      lender: '0xabc...def',
      amount: 9800,
      tokenType: 'mUSDC',
      interest: 4.5,
      status: 'pending'
    }
  ]);

  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([
    {
      id: '1',
      tokenId: '0x789',
      borrower: '0xUserAddress',
      lender: '0x789...abc',
      amount: 7500,
      tokenType: 'mUSDC',
      interest: 5.0,
      dueDate: new Date('2024-07-30'),
      status: 'active'
    }
  ]);

  const [myLenderOffers, setMyLenderOffers] = useState<LoanOffer[]>([
    {
      id: '1',
      tokenId: '0xaaa',
      lender: '0xCurrentUser',
      borrower: '0xbbb...ccc',
      amount: 14800,
      tokenType: 'mUSDC',
      interest: 5.5,
      status: 'pending'
    }
  ]);


 

  // API hooks
  const { getFile } = usePinata();

  const { 
    data: mintedData, 
    loading: loadingMinted, 
    refetch: refetchMintedInvoices 
  } = useQuery(GET_MINTED_INVOICES, {
    variables: { owner: account },
    onCompleted: async (data) => {
      console.log('Minted Data:', data);
    }, fetchPolicy: 'network-only',
  });

  const { 
    data: listedData, 
    loading: loadingListed,
    refetch: refetchInvoicesByOwner 
  } = useQuery(GET_INVOICES_BY_OWNER, {
    variables: { owner: account }, fetchPolicy: 'network-only',
  });
  
  const { 
    data: totalBorrowedAndLentByUser, 
    loading: totalBorrowedAndLentByUserLoading,
    refetch: refetchTotalBorrowedAndLent
  } = useQuery(GET_TOTAL_BORROWED_AND_LENT_BY_USER, {
    variables: { user: account },
    onCompleted: async (data) => {
      console.log('BORROWED_AND_LENT_BY_USER:', data);
    }, fetchPolicy: 'network-only',
  });

  const {
    data: userReputationData,
    loading: userReputationLoading,
    refetch: refetchUserReputation
  } = useQuery(GET_USER_REPUTATION, {
    variables: { user: account },
    onCompleted: async (data) => {
      console.log('userReputation:', data);
    }, fetchPolicy: 'network-only',
  });

  const {
    data: activeLoansData,
    loading: activeLoansLoading,
    refetch: refetchActiveLoans
  } = useQuery(GET_ACTIVE_LOANS, {
    variables: { user: account },
    onCompleted: async (data) => {
      console.log('ACTIVE_LOANS:', data);
    }, fetchPolicy: 'network-only',
  });
  // Offer form state
  const [selectedInvoice, setSelectedInvoice] = useState<LoanOffer | null>(null);
  const [offerFormVisible, setOfferFormVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerInterest, setOfferInterest] = useState('');
  const [offerToken, setOfferToken] = useState('mUSDC');
 
  // Mint modal state

  const { lendingMarketplaceService, isInitialized } = useContractService();




  // Navigation sections
  const sections: Section[] = [
    { id: 'my-invoices', name: 'My Invoices', icon: DollarSign },
    { id: 'loan-offers', name: 'Loan Offers', icon: UserPlus },
    { id: 'active-loans', name: 'Active Loans', icon: CreditCard }
  ];



  // Effect hooks
  useEffect(() => {
    const now = BigInt(Math.floor(Date.now() / 1000)); // Current time in UNIX timestamp
    setCurrentDate(now.toString());
    const threeDays = BigInt(3 * 24 * 60 * 60);
    setThreeDaysLater((now + threeDays).toString()); // 3 days later
  }, []);

  useEffect(() => {
    if (!totalBorrowedAndLentByUserLoading && totalBorrowedAndLentByUser) {
      const totalBorrowed = totalBorrowedAndLentByUser?.borrowers?.reduce((acc: number, borrower: any) => {
        return acc + borrower.invoices.reduce((sum: number, invoice: any) => sum + Number(invoice.loanAmount), 0);
      }, 0) || 0;
      
      const totalLent = totalBorrowedAndLentByUser?.lenders?.reduce((acc: number, lender: any) => {
        return acc + lender.loans.reduce((sum: number, loan: any) => sum + Number(loan.loanAmount), 0);
      }, 0) || 0;
      
      setTotalBorrowed(parseFloat(totalBorrowed));
      setTotalLent(parseFloat(totalLent));
    }
  }, [totalBorrowedAndLentByUserLoading, totalBorrowedAndLentByUser]);


  useEffect(() => {
    if (mintedData && listedData) {
      try {
        const processInvoices = async () => {
          // Process minted invoices with IPFS data
          const mintedInvoicesPromises = mintedData.invoiceMinteds
            .filter((invoice: Invoice) => 
              invoice.ipfsCID !== "invoice 1" && invoice.ipfsCID !== "invoice 2"
            )
            .map(async (invoice: Invoice) => {
              let ipfsData = null;
              
              // Fetch IPFS data if CID exists and not excluded
              if (invoice.ipfsCID) {
                try {
                  ipfsData = await getFile(invoice.ipfsCID);
                } catch (error) {
                  console.error(`Error fetching IPFS data for invoice ${invoice.tokenId}:`, error);
                }
              }
              
              return {
                ...invoice,
                status: 'minted',
                // Set fields from IPFS data if available
                dueDate: ipfsData?.attributes?.dueDate || new Date(parseInt(invoice?.blockTimestamp) * 1000),
                amount: ipfsData?.attributes?.amount || undefined,
                payerName: ipfsData?.attributes?.payerName || undefined,
                // Convert timestamp to Date if needed
              };
            });
  
          // Wait for all promises to resolve
          const processedMintedInvoices = await Promise.all(mintedInvoicesPromises);
  
          const listedInvoices = listedData.invoices.map((invoice: any) => {
            // Determine status based on the API response
            let status: 'minted' | 'listed' | 'funded' | 'repaid' = 'listed';
            if (invoice.status === 'LOANED') {
              status = 'funded';
            } else if (invoice.status === 'REPAID') {
              status = 'repaid';
            }
  
            return {
              ...invoice,
              status,
              // Convert dueDate from unix timestamp to Date
              dueDate: invoice.dueDate ? new Date(parseInt(invoice.dueDate) * 1000) : undefined,
              // If borrower/lender are objects, extract the id
              borrower: invoice.borrower?.id || invoice.borrower,
              lender: invoice.lender?.id || invoice.lender,
              // Convert loanAmount from string to number if needed for display
              amount: invoice.loanAmount ? parseFloat(invoice.loanAmount) : undefined
            };
          });
  
          // Remove duplicates using a Set
          const listedTokenIds = new Set(listedInvoices.map((i: any) => i.tokenId));
          const unlistedMintedInvoices = processedMintedInvoices.filter((invoice: any) => 
            !listedTokenIds.has(invoice.tokenId)
          );
  
          // Merge and set state
          setAllInvoices([...listedInvoices, ...unlistedMintedInvoices]);
        };
  
        // Execute the async function
        processInvoices().catch(error => {
          console.error('Error in invoice processing:', error);
        });
      } catch (error) {
        console.error('Error processing invoice data:', error);
      }
    }
  }, [mintedData, listedData]);

  // Due soon loans query
  const {
    data: dueSoonLoans, 
    loading: dueSoonLoansLoading,
    refetch: refetchDueSoonLoans
  } = useQuery(GET_DUE_SOON_LOANS, {
    variables: { userAddress: account, currentDate, threeDaysLater },
    skip: !currentDate || !threeDaysLater,
    fetchPolicy: 'network-only',
    onCompleted: async (data) => {
      console.log('DUE_SOON_LOANS:', data);
    }
  });




  const { 
    data: offerSentData, 
    loading: sentLoading, 
    error: sentError,
    refetch: refetchOffersSent 
  } = useQuery(GET_YOUR_OFFERS_SENT, {
    variables: { lenderId: account },
    skip: !account,
    fetchPolicy: 'network-only',
    onCompleted: async (data) => {
      console.log('YOUR_OFFERS_SENT:', data);
    }
  });

  const { data: invoiceData, loading: invoiceLoading } = useQuery(GET_INVOICE_IDS_BY_BORROWER, {
    variables: { borrowerId: account },
    skip: !account,
  });

  const invoiceIds = invoiceData?.invoices.map((invoice) => invoice.id) || [];

  const { 
    data: offerData, 
    loading: offerLoading, 
    error: offerError,
    refetch: refetchOffersReceived 
  } = useQuery(GET_YOUR_OFFERS_RECEIVED, {
    variables: { invoiceIds },
    skip: invoiceLoading || invoiceIds.length === 0,
    onCompleted: async (data) => {
      console.log('YOUR_OFFERS_RECEIVED:', data);
    }
  });

  const { 
    data: borrowerLoans, 
    loading: borrowerLoading, 
    error: borrowerError,
    refetch: refetchActiveLoansAsBorrower 
  } = useQuery(GET_ACTIVE_LOANS_AS_BORROWER, {
    variables: { borrowerId: account }, 
    skip: !account,
    onCompleted: async (data) => {
      console.log('ACTIVE_LOANS_AS_BORROWER:', data);
    }
  });
  
  const { 
    data: lenderLoans, 
    loading: lenderLoading, 
    error: lenderError,
    refetch: refetchActiveLoansAsLender 
  } = useQuery(GET_ACTIVE_LOANS_AS_LENDER, {
    variables: { lenderId: account },
    skip: !account,
    onCompleted: async (data) => {
      console.log('ACTIVE_LOANS_AS_LENDER:', data);
    }
  });
  

  
  // Event handlers

  const handleListForLoan = async (invoice: Invoice) => {
    if (!isInitialized || !lendingMarketplaceService) {
      message.error('Contract not connected');
      return;
    }
    
    console.log(`Listing invoice ${invoice.dueDate} for loan`);
  
    if (!invoice?.ipfsCID) {
      message.error('ipfsCID not found');
      return;
    }
    
    try {
      const ipfsData = await getFile(invoice?.ipfsCID);
      console.log(ipfsData?.attributes.payerName);
      let date = new Date(ipfsData.attributes.dueDate).getTime();
      
      // Update UI optimistically first (for immediate feedback)
      const updatedInvoices = allInvoices.map(inv => 
        inv.tokenId === invoice.tokenId ? {...inv, status: 'listed' as const} : inv
      );
      setAllInvoices(updatedInvoices);
      
      // Then perform the blockchain transaction
      await lendingMarketplaceService.listInvoiceForLoan(
        Number(invoice.tokenId), 
        date, 
        ipfsData.attributes.amount, 
        ipfsData?.attributes.payerName
      );
      
      // Refetch queries to ensure data consistency
      refetchInvoicesByOwner();
      refetchMintedInvoices();
      
      message.success("Invoice Successfully Listed For Loan");
    } catch (err) {
      // Revert optimistic update on failure
      refetchInvoicesByOwner();
      refetchMintedInvoices();
      message.error("Something wrong! Invoice cannot be listed");
      console.error(err);
    }
  };
  
  const handleAcceptOffer = async (offer: LoanOffer) => {
    if (!isInitialized || !lendingMarketplaceService) {
      message.error('Contract not connected');
      return;
    }
    
    console.log(`Accepting offer from ${offer.lender} for ${offer.amount} ${offer.tokenType}`);
  
    try {
      // Update UI optimistically
       // Perform blockchain transaction
       await lendingMarketplaceService.acceptLoanOffer(Number(offer.tokenId), offer.lender);
      const updatedInvoices = allInvoices.map(invoice => 
        invoice.tokenId === offer.tokenId ? {...invoice, status: 'funded' as const} : invoice
      );
      setAllInvoices(updatedInvoices);
      
      // Remove all offers for this invoice
      setPendingOffers(pendingOffers.filter(o => o.tokenId !== offer.tokenId));
      
      // Add to active loans
      const newLoan: ActiveLoan = {
        id: `loan-${Date.now()}`,
        tokenId: offer.tokenId,
        borrower: account as string, // Current user
        lender: offer.lender,
        amount: Number(offer.amount),
        tokenType: offer.tokenType,
        interest: Number(offer.interest),
        dueDate: (allInvoices.find(i => i.tokenId === offer.tokenId)?.dueDate || new Date()) as Date,
        status: 'active' as const
      };
      setActiveLoans([...activeLoans, newLoan]);
      
     
      
      // Refetch to ensure consistency
      refetchInvoicesByOwner();
      refetchActiveLoans();
      refetchOffersReceived();
      refetchTotalBorrowedAndLent();
      
      message.success('Offer accepted successfully');
    } catch (error) {
      // Revert optimistic updates on failure
      refetchInvoicesByOwner();
      refetchActiveLoans();
      refetchOffersReceived();
      
      message.error('Error accepting offer');
      console.error('Error accepting offer:', error);
    }
  };
  
  const handleRepayLoan = async (loan: ActiveLoan) => {
    if (!isInitialized || !lendingMarketplaceService) {
      message.error('Contract not connected');
      return;
    }
    
    console.log(`Repaying loan for ${loan.amount} ${loan.tokenType} ${loan.tokenId}`);
  
    try {
      await lendingMarketplaceService.repayLoan(Number(loan.tokenId));
      // Update UI optimistically
      const updatedLoans = activeLoans.filter(l => l.id !== loan.id);
      setActiveLoans(updatedLoans);
      
      // Update invoice status
      const updatedInvoices = allInvoices.map(invoice => 
        invoice.tokenId === loan.tokenId ? {...invoice, status: 'repaid' as const} : invoice
      );
      setAllInvoices(updatedInvoices);
      
      // Perform blockchain transaction
      
      
      // Refetch for consistency
      refetchInvoicesByOwner();
      refetchActiveLoansAsBorrower();
      refetchActiveLoansAsLender();
      refetchTotalBorrowedAndLent();
      refetchUserReputation();
      
      message.success("Loan repaid successfully!");
    } catch (err) {
      // Revert optimistic updates
      refetchInvoicesByOwner();
      refetchActiveLoansAsBorrower();
      refetchActiveLoansAsLender();
      
      message.error("Loan repayment unsuccessful!");
      console.log(err);
    }
  };
  
  const handleCancelOffer = async (offer: LoanOffer) => {
    if (!isInitialized || !lendingMarketplaceService) {
      message.error('Contract not connected');
      return;
    }
    
    try {
       // Perform blockchain transaction
       await lendingMarketplaceService.cancelOffer(Number(offer.tokenId));
      // Update UI optimistically
      setMyLenderOffers(myLenderOffers.filter(o => o.tokenId !== offer.tokenId));
      
     
      
      // Refetch for consistency
      refetchOffersSent();
      
      message.success("Offer cancelled successfully");
    } catch (err) {
      // Revert optimistic update
      refetchOffersSent();
      
      message.error("Offer can't be cancelled");
      console.error(err);
    }
  };
  
  const handleClaimDefault = async (loan: ActiveLoan) => {
    if (!isInitialized || !lendingMarketplaceService) {
      message.error('Contract not connected');
      return;
    }
    
    console.log(`Claiming NFT for defaulted loan on token ${loan.tokenId}`);
    
    try {
      // Perform blockchain transaction
      await lendingMarketplaceService.claimOverdueInvoice(Number(loan.tokenId));
      // Update UI optimistically
      const updatedLoans = activeLoans.filter(l => l.tokenId !== loan.tokenId);
      setActiveLoans(updatedLoans);
      
      
      
      // Refetch for consistency
      refetchActiveLoansAsLender();
      refetchInvoicesByOwner();
      refetchMintedInvoices();
      
      message.success("Loan claimed successfully");
    } catch (err) {
      // Revert optimistic update
      refetchActiveLoansAsLender();
      
      message.error("Loan can't be claimed");
      console.error(err);
    }
  };

  
  //  const handleMakeOffer = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Implementation for making an offer
  //   console.log('Making offer with:', offerAmount, offerInterest, offerToken);
  //   setOfferFormVisible(false);
  // };

  // Derived values
  // Filtered invoices based on status
  const filteredInvoices = statusFilter === 'all' 
    ? allInvoices 
    : allInvoices.filter(invoice => invoice.status === statusFilter);
  
  // Get active loans based on selected tab
  // const currentLoans = loanTab === 'borrowed' ? myBorrowedLoans : myLentLoans;

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Lent */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-purple-50 rounded-lg p-3">
                <CircleDollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Lent</h3>
              { totalBorrowedAndLentByUserLoading ? <p className="text-xl font-semibold text-gray-900">Loading...</p> : <p className="text-xl font-semibold text-gray-900">${totalLent.toFixed(2)}</p>}
            </div>
          </div>
        </div>

        {/* Total Borrowed */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-pink-50 rounded-lg p-3">
                <Wallet className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Borrowed</h3>
              { totalBorrowedAndLentByUserLoading ? <p className="text-xl font-semibold text-gray-900">Loading...</p> : <p className="text-xl font-semibold text-gray-900">${totalBorrowed.toFixed(2)}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-green-50 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Reputation</h3>
              { userReputationLoading ? <p className="text-xl font-semibold text-gray-900">Loading...</p> : <p className="text-xl font-semibold text-gray-900">{userReputationData?.borrower?.reputation || "N/A"}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-blue-50 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Loans</h3>
              { activeLoansLoading ? <p className="text-xl font-semibold text-gray-900">Loading...</p> :  <p className="text-xl font-semibold text-gray-900">{activeLoansData?.invoices?.length || 0}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-yellow-50 rounded-lg p-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Due Soon</h3>
              { dueSoonLoansLoading ? <p className="text-xl font-semibold text-gray-900">Loading...</p> : <p className="text-xl font-semibold text-gray-900">{dueSoonLoans?.borrowerInvoices?.length + dueSoonLoans?.lenderInvoices
?.length|| 0}
</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`flex items-center px-5 py-4 text-sm font-medium ${
                activeSection === section.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon className="h-5 w-5 mr-2" />
              {section.name}
            </button>
          ))}
          
          {activeSection === 'my-invoices' && (
            <div className="ml-auto pr-5 flex items-center">
              {/* Status Filter Dropdown */}
              <div className="mr-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-8 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Invoices</option>
                    <option value="minted">Minted</option>
                    <option value="listed">Listed</option>
                    <option value="funded">Funded</option>
                    <option value="repaid">Repaid</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
              
              <button 
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
                onClick={()=>navigate('/mint')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Mint Invoice
              </button>
            </div>
          )}
        </div>

        {/* Section Content */}
        <div className="p-4">
          {/* My Invoices Section */}
          {activeSection === 'my-invoices' && (
  <>
    <InvoiceList 
      invoices={filteredInvoices} 
      loading={loadingMinted || loadingListed}
      handleListForLoan={handleListForLoan}
      handleRepayLoan={handleRepayLoan}
    />
  </>
)}

          {/* Loan Offers Section */}
          {activeSection === 'loan-offers' && (
            <div className="space-y-4">
              {/* Tabs for Loan Offers */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    offerTab === 'received'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setOfferTab('received')}
                >
                  Offers Received
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    offerTab === 'yours'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setOfferTab('yours')}
                >
                  Your Offers
                </button>
              </div>

              <OffersList 
      offerData={offerData}
      offerSentData={offerSentData}
      offerLoading={offerLoading}
      sentLoading={sentLoading}
      offerError={offerError}
      sentError={sentError}
      offerTab={offerTab}
      handleAcceptOffer={handleAcceptOffer}
   
      handleCancelOffer={handleCancelOffer}
    />
            </div>
          )}

          {/* Active Loans Section */}
          {activeSection === 'active-loans' && (
            <div className="space-y-4">
              {/* Tabs for Active Loans */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    loanTab === 'borrowed'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setLoanTab('borrowed')}
                >
                  Borrowed
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    loanTab === 'lent'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setLoanTab('lent')}
                >
                  Lent
                </button>
              </div>

              {/* Active Loans Content */}
              <div className="divide-y divide-gray-100">
           

<LoanList 
      lenderLoans={lenderLoans}
      borrowerLoans={borrowerLoans}
      lenderLoading={lenderLoading}
      borrowerLoading={borrowerLoading}
      lenderError={lenderError}
      borrowerError={borrowerError}
      loanTab={loanTab}
      handleRepayLoan={handleRepayLoan}
      handleClaimDefault={handleClaimDefault}
    />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offer Form Modal
      {offerFormVisible && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Make Loan Offer</h2>
            <p className="text-sm text-gray-500 mb-4">
              For invoice from {selectedInvoice.borrower}
            </p>
            
            <form onSubmit={handleMakeOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{offerToken}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.0"
                  value={offerInterest}
                  onChange={(e) => setOfferInterest(e.target.value)}
                  step="0.1"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token Type
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={offerToken}
                  onChange={(e) => setOfferToken(e.target.value)}
                >
                  <option value="mUSDC">mUSDC</option>
                  <option value="mUSDT">mUSDT</option>
                  <option value="mDAI">mDAI</option>
                </select>
              </div>
              
              <div className="flex space-x-3 justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    setOfferFormVisible(false);
                    setSelectedInvoice(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      
  
    </div>
  );
}