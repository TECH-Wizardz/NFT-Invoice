import { BaseContractService } from './BaseContractService';
import LendingMarketplaceABI from '../abis/LendingMarketplace.json';

export class LendingMarketplaceService extends BaseContractService {
  async init() {
    const contractAddress = import.meta.env.VITE_LENDING_MARKETPLACE_ADDRESS;
    if (!contractAddress) {
      throw new Error('LendingMarketplace contract address not found in environment variables');
    }
    return super.init(contractAddress, LendingMarketplaceABI.abi);
  }

  async listInvoiceForLoan(tokenId: number, dueDate: number, amount: number | string, payerName: string) {
    this.checkInitialized();
    const tx = await this.contract!.listInvoiceForLoan(tokenId, dueDate, amount, payerName);
    return await tx.wait();
  }

  async offerLoan(tokenId: number, token: string, loanAmount: number | string, interest: number | string) {
    this.checkInitialized();
    const tx = await this.contract!.offerLoan(tokenId, token, loanAmount, interest);
    return await tx.wait();
  }

  async acceptLoanOffer(tokenId: number, lender: string) {
    this.checkInitialized();
    console.log(tokenId, lender);
    const tx = await this.contract!.acceptLoanOffer(tokenId, lender);
    return await tx.wait();
  }

  async repayLoan(tokenId: number) {
    this.checkInitialized();
    const tx = await this.contract!.repayLoan(tokenId);
    return await tx.wait();
  }

  async cancelOffer(tokenId: number) {
    this.checkInitialized();
    const tx = await this.contract!.cancelOffer(tokenId);
    return await tx.wait();
  }

  async claimOverdueInvoice(tokenId: number) {
    this.checkInitialized();
    const tx = await this.contract!.claimOverdueInvoice(tokenId);
    return await tx.wait();
  }

  async getLoan(tokenId: number) {
    this.checkInitialized();
    const loan = await this.contract!.loans(tokenId);
    return {
      borrower: loan[0],
      lender: loan[1],
      token: loan[2],
      loanAmount: loan[3],
      interest: loan[4],
      dueDate: loan[5],
      isActive: loan[6]
    };
  }

  async getOffers(tokenId: number) {
    this.checkInitialized();
    const [lenders, amounts, interests] = await this.contract!.getOffers(tokenId);
    return {
      lenders,
      amounts,
      interests
    };
  }

  async getRiskFactor(tokenId: number) {
    this.checkInitialized();
    const riskFactor = await this.contract!.riskFactor(tokenId);
    return Number(riskFactor);
  }

  async isInvoiceListed(tokenId: number) {
    this.checkInitialized();
    return await this.contract!.isInvoiceListed(tokenId);
  }

  async addSupportedToken(token: string) {
    this.checkInitialized();
    const tx = await this.contract!.addSupportedToken(token);
    return await tx.wait();
  }

  async isSupportedToken(token: string) {
    this.checkInitialized();
    return await this.contract!.supportedTokens(token);
  }

  async getPendingOffer(tokenId: number, lender: string) {
    this.checkInitialized();
    return await this.contract!.pendingOffers(tokenId, lender);
  }

  async getOfferLenders(tokenId: number, index: number) {
    this.checkInitialized();
    return await this.contract!.offerLenders(tokenId, index);
  }

  async getNftContract() {
    this.checkInitialized();
    return await this.contract!.nftContract();
  }

  async getOwner() {
    this.checkInitialized();
    return await this.contract!.owner();
  }
} 