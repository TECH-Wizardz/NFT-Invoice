import { BaseContractService } from './BaseContractService';
import ERC20_ABI from '../abis/ERC20.json';

export class ERC20TokenService extends BaseContractService {
  private tokenAddress: string;

  constructor(provider: any, tokenAddress: string) {
    super(provider);
    this.tokenAddress = tokenAddress;
  }

  async init() {
    return super.init(this.tokenAddress, ERC20_ABI);
  }

  async approve(spender: string, amount: string | number | bigint) {
    this.checkInitialized();
    const tx = await this.contract!.approve(spender, amount);
    return await tx.wait();
  }

  async getBalance(account: string): Promise<bigint> {
    this.checkInitialized();
    return await this.contract!.balanceOf(account);
  }

  async transfer(to: string, amount: number | string) {
    this.checkInitialized();
    const tx = await this.contract!.transfer(to, amount);
    return await tx.wait();
  }

  async transferFrom(from: string, to: string, amount: number | string) {
    this.checkInitialized();
    const tx = await this.contract!.transferFrom(from, to, amount);
    return await tx.wait();
  }
} 