import { gql } from "@apollo/client";

// Query for Minted Invoices
export const GET_MINTED_INVOICES = gql`
  query GetMintedInvoices($owner: Bytes!) {
    invoiceMinteds(where: { owner: $owner }) {
      tokenId
      owner
      ipfsCID
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;




// Query for Invoices Listed in Marketplace
export const GET_INVOICES_BY_OWNER = gql`
  query GetInvoicesByOwner($owner: Bytes!) {
    invoices(where: { borrower: $owner }) {
      tokenId
      borrower {
        id
      }
      lender {
        id
      }
      loanAmount
      payerName
      interest
      dueDate
      status
      createdAt
    }
  }
`;



export const GET_LISTED_INVOICES = gql`
  query GetListedInvoices {
    invoices(where: { status: LISTED }) {
      id
      tokenId
      borrower {
        id
      }
      lender {
        id
      }
      loanAmount
      interest
      dueDate
      createdAt
    }
  }
`;


export const GET_USER_REPUTATION = gql`
  query GetUserReputation($user: Bytes!) {
    borrower(id: $user) {
      id
      reputation
    }
  }
`;


export const GET_ACTIVE_LOANS = gql`
  query GetActiveLoans {
    invoices(where: { status: LOANED }) {
      id
      tokenId
      borrower {
        id
      }
      lender {
        id
      }
      loanAmount
      interest
      dueDate
      createdAt
    }
  }
`;







export const GET_DUE_SOON_LOANS = gql`
  query GetDueSoonLoans($userAddress: Bytes!, $currentDate: BigInt!, $threeDaysLater: BigInt!) {
    borrowerInvoices: invoices(where: { borrower: $userAddress, status: LOANED, dueDate_gte: $currentDate, dueDate_lte: $threeDaysLater }) {
      id
      tokenId
      borrower {
        id
      }
      lender {
        id
      }
      loanAmount
      interest
      dueDate
      createdAt
    }
    lenderInvoices: invoices(where: { lender: $userAddress, status: LOANED, dueDate_gte: $currentDate, dueDate_lte: $threeDaysLater }) {
      id
      tokenId
      borrower {
        id
      }
      lender {
        id
      }
      loanAmount
      interest
      dueDate
      createdAt
    }
  }
`;



export const GET_TOTAL_BORROWED_AND_LENT_BY_USER = gql`
  query GetTotalBorrowedAndLentByUser($user: Bytes!) {
    borrowers(where: { id: $user }) {
      id
      invoices {
        loanAmount
      }
    }
    lenders(where: { id: $user }) {
      id
      loans {
        loanAmount
      }
    }
  }
`;








export const GET_ALL_INVOICES_WITH_IPFS = gql`
  query GetAllInvoicesWithIPFS($first: Int = 100, $skip: Int = 0) {
    invoices(first: $first, skip: $skip) {
      id
      tokenId
      borrower {
        id
        address
      }
      lender {
        id
        address
      }
      token {
        id
        address
      }
      loanAmount
      interest
      dueDate
      isActive
      amount
      payerName
      riskFactor
      createdAt
      status
    }
    
    invoiceMinteds(first: 1000) {
      tokenId
      ipfsCID
      owner
      blockTimestamp
    }
  }
`;








export const GET_YOUR_OFFERS_SENT = gql`
  query GetYourOffersSent($lenderId: Bytes!) {
    offers(where: { lender_: { id: $lenderId } }) {
      id
      invoice {
        id
        loanAmount
        dueDate
        status
        borrower {
          id
        }
      }
      token {
        id
      }
      amount
      interest
      status
      createdAt
    }
  }
`;



export const GET_INVOICE_IDS_BY_BORROWER = gql`
  query GetInvoiceIdsByBorrower($borrowerId: Bytes!) {
    invoices(where: { borrower: $borrowerId }) {
      id
    }
  }
`;


export const GET_YOUR_OFFERS_RECEIVED = gql`
  query GetYourOffersReceived($invoiceIds: [ID!]!) {
    offers(where: { invoice_in: $invoiceIds }) {
      id
      invoice {
        id
        loanAmount
        dueDate
        status
      }
      lender {
        id
      }
      amount
      interest
      status
      createdAt
    }
  }
`;


export const GET_ACTIVE_LOANS_AS_BORROWER = gql`
  query GetActiveLoansAsBorrower($borrowerId: Bytes!) {
    invoices(where: { borrower: $borrowerId, status: LOANED }) {
      id
      tokenId
      lender {
        id
      }
      loanAmount
      interest
      dueDate
      createdAt
    }
  }
`;


export const GET_ACTIVE_LOANS_AS_LENDER = gql`
  query GetActiveLoansAsLender($lenderId: Bytes!) {
    invoices(where: { lender: $lenderId, status: LOANED }) {
      id
      tokenId
      borrower {
        id
      }
      loanAmount
      interest
      dueDate
      createdAt
    }
  }
`;



export const GET_LISTED_INVOICE_TOKEN_IDS = gql`
  query GetListedInvoiceTokenIds($payerName: String) {
    invoices(where: { status: LISTED, payerName_contains_nocase: $payerName }) {
      tokenId
    }
  }
`;



export const GET_MINTED_INVOICES_BY_TOKEN_IDS = gql`
  query GetMintedInvoicesByTokenIds($tokenIds: [BigInt!]!) {
    invoiceMinteds(where: { tokenId_in: $tokenIds }) {
      id
      tokenId
      owner
      ipfsCID
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;



export const GET_INVOICE_MINTED_BY_TOKEN_ID = gql`
  query GetInvoiceMintedByTokenId($tokenId: BigInt!) {
    invoiceMinteds(where: { tokenId: $tokenId }) {
      id
      tokenId
      owner
      ipfsCID
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;