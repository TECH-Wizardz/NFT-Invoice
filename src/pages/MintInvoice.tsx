// MintInvoice.tsx (Parent Component)
import  { useState } from 'react';
import { useContractService } from '../hooks/useContractService';
import { usePinata } from '../hooks/usePinata';
import { MintInvoiceForm, MintInvoiceFormData } from '../components/MintInvoiceForm';

export function MintInvoice() {
  const { invoiceNFTService, isInitialized, isInitializing, error } = useContractService();
  const { uploadJSON, uploadFile,  error: ipfsError } = usePinata();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ipfsCid, setIpfsCid] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState('');
  const [nftId, setNftId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadToIPFS = async (data: MintInvoiceFormData) => {
    try {
      if (!selectedFile) {
        console.error('No file selected when trying to upload to IPFS');
        throw new Error('No file selected');
      }
      
      console.log('Uploading to IPFS:', selectedFile.name);
      
      // Upload the image file to IPFS
      const imageCid = await uploadFile(selectedFile);
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageCid}`;
      
      console.log('Image uploaded successfully with CID:', imageCid);
      
      // Create metadata object
      const metadata = {
        name: `Invoice #${Date.now()}`,
        description: data.description,
        image: imageUrl,
        attributes: {
          amount: data.amount,
          dueDate: data.dueDate.format('YYYY-MM-DD'),
          payerName: data.payerName
        }
      };
      
      // Upload the metadata to IPFS
      const metadataCid = await uploadJSON(metadata);
      console.log('Metadata uploaded successfully with CID:', metadataCid);
      
      setIpfsCid(metadataCid);
      return metadataCid;
    } catch (err) {
      console.error('Error uploading to IPFS:', err);
      throw err;
    }
  };
  
  const handleFileChange = (file: File | null) => {
    console.log('File selection changed:', file ? file.name : 'null');
    setSelectedFile(file);
    
    // If file was removed, clear the IPFS CID as well
    if (!file) {
      setIpfsCid('');
    }
  };
  
  const onSubmit = async (data: MintInvoiceFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Selected file from state:', selectedFile ? selectedFile.name : 'null');
    
    if (!invoiceNFTService || !isInitialized) {
      setTxError('Invoice NFT service not initialized');
      return;
    }
    
    if (!selectedFile) {
      console.error('No file selected when submitting form');
      setTxError('Please select an image file');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setTxError('');
      setTxHash('');
      
      console.log('Starting IPFS upload process');
      // Upload to IPFS
      const cid = await uploadToIPFS(data);
      console.log('IPFS upload complete with CID:', cid);
      
      console.log('Starting NFT minting process');
      // Mint the invoice NFT
      const receipt = await invoiceNFTService.mintInvoice(cid);
      console.log('NFT minted successfully with receipt:', receipt);
      
      setTxHash(receipt.hash);
      
      // Extract the NFT ID (in production, this would come from event logs)
      const mockNftId = Math.floor(Math.random() * 1000) + 1;
      setNftId(mockNftId);
      console.log('Set mock NFT ID:', mockNftId);
      
    } catch (err) {
      console.error('Error minting invoice:', err);
      setTxError(`Error minting invoice: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to reset the form state, including the file
  const resetForm = () => {
    setSelectedFile(null);
    setIpfsCid('');
  };

  return (
    <MintInvoiceForm
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isInitializing={isInitializing}
      isInitialized={isInitialized}
      error={error ? error : ipfsError}
      ipfsCid={ipfsCid}
      txHash={txHash}
      txError={txError}
      nftId={nftId}
      onFileChange={handleFileChange}
      selectedFile={selectedFile}
      resetForm={resetForm}
    />
  );
}