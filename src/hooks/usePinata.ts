import { useState } from 'react';
import { PinataService } from '../services/PinataService';

export const usePinata = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const pinataService = new PinataService();

  const uploadJSON = async (data: any) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const cid = await pinataService.uploadJSON(data);
      return cid;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading to IPFS');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const cid = await pinataService.uploadFile(file);
      return cid;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading to IPFS');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const getFile = async (cid: string) => {
    try {
      return await pinataService.fetchFromIPFS(cid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting file from IPFS');
      throw err;
    }
  };

  return {
    uploadJSON,
    uploadFile,
    getFile,
    isUploading,
    error
  };
}; 