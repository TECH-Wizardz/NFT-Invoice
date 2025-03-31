import { BrowserProvider, Contract, Signer } from 'ethers';

export class BaseContractService {
  protected provider: BrowserProvider;
  protected signer: Signer | null = null;
  protected contract: Contract | null = null;
  protected initialized: boolean = false;

  constructor(provider: BrowserProvider) {
    this.provider = provider;
  }

  async init(contractAddress: string, abi: any) {
    try {
      this.signer = await this.provider.getSigner();
      this.contract = new Contract(
        contractAddress,
        abi,
        this.signer
      );
      this.initialized = true;
      return true;
    } catch (error) {
      console.error(`Error initializing contract: ${error}`);
      this.initialized = false;
      return false;
    }
  }

  protected checkInitialized() {
    if (!this.initialized || !this.contract || !this.signer) {
      throw new Error('Contract service not initialized');
    }
  }
} 