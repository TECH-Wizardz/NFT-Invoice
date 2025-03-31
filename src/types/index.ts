// export interface Invoice {
//   id: string;
//   tokenId?: string;
//   amount: number;
//   dueDate: Date;
//   payerName: string;
//   description: string;
//   status: 'draft' | 'minted' | 'listed' | 'loaned' | 'paid' | 'defaulted';
//   ipfsCid?: string;
// }

export interface LoanOffer {
  id: string;
  lender: string;
  tokenSymbol: string;
  amount: number;
  interestRate: number;
  duration: number;
  invoiceId: string;
}

export interface Pool {
  id: string;
  tokenSymbol: string;
  totalFunds: number;
  invoiceCount: number;
  profitEarned: number;
  status: 'active' | 'closed';
}

export interface User {
  address: string;
  reputationScore: number;
  type: 'borrower' | 'lender' | 'pool-investor';
}





export interface ActiveLoan {
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




export interface Invoice {
  id?: string;
  tokenId: string;
  owner?: string;
  ipfsCID?: string;
  borrower?: { id: string } | string;
  lender?: { id: string } | string;
  amount?: number;
  loanAmount?: string;
  dueDate?: Date | string;
  payerName?: string;
  description?: string;
  interest?: string;
  status?: 'minted' | 'listed' | 'funded' | 'repaid' | 'LOANED';
  createdAt?: string;
  blockTimestamp?: string;
}