import { BaseContractService } from './BaseContractService';
import InvoiceNFTABI from '../abis/InvoiceNFT.json';

export class InvoiceNFTService extends BaseContractService {
  async init() {
    const contractAddress = import.meta.env.VITE_INVOICE_NFT_ADDRESS;
    if (!contractAddress) {
      throw new Error('InvoiceNFT contract address not found in environment variables');
    }
    return super.init(contractAddress, InvoiceNFTABI.abi);
  }

  async mintInvoice(tokenURI: string) {
    this.checkInitialized();
    const tx = await this.contract!.mintInvoice(tokenURI);
    return await tx.wait();
  }

  async getOwnerOf(tokenId: number) {
    this.checkInitialized();
    return await this.contract!.ownerOf(tokenId);
  }

  async getTokenURI(tokenId: number) {
    this.checkInitialized();
    return await this.contract!.tokenURIs(tokenId);
  }

  async getReputation(account: string) {
    this.checkInitialized();
    const reputation = await this.contract!.getReputation(account);
    return Number(reputation);
  }

  async approveNFT(to: string, tokenId: number) {
    this.checkInitialized();
    const tx = await this.contract!.approve(to, tokenId);
    return await tx.wait();
  }
} 