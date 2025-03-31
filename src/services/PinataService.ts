import axios from 'axios';

export class PinataService {
  private readonly jwt: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseURL = 'https://api.pinata.cloud';

  constructor() {
    this.jwt = import.meta.env.VITE_PINATA_JWT ?? '';
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY ?? '';
    this.apiSecret = import.meta.env.VITE_PINATA_API_SECRET ?? '';

    if (!this.jwt && (!this.apiKey || !this.apiSecret)) {
      throw new Error('Pinata credentials not found in environment variables');
    }
  }

  private getHeaders() {
    if (this.jwt) {
      return {
        Authorization: `Bearer ${this.jwt}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'pinata_api_key': this.apiKey,
      'pinata_secret_api_key': this.apiSecret,
      'Content-Type': 'application/json'
    };
  }

  async uploadJSON(data: Record<string, unknown>): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/pinning/pinJSONToIPFS`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw new Error('Failed to upload to Pinata');
    }
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw new Error('Failed to upload file to Pinata');
    }
  }

  async unpin(hash: string): Promise<void> {
    try {
      await axios.delete(
        `${this.baseURL}/pinning/unpin/${hash}`,
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('Error unpinning from Pinata:', error);
      throw new Error('Failed to unpin from Pinata');
    }
  }

  async fetchFromIPFS(hash: string): Promise<string> {

      const { data } = await axios.get<string>(
        `https://orange-genetic-finch-331.mypinata.cloud/ipfs/${hash}`
      );
      console.log('Fetched from Pinata:', data);
      return data;
 
  }
}
        