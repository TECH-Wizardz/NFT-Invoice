// MintInvoiceForm.tsx (Child Component)
import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Button, Card, Alert, Upload } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

export interface MintInvoiceFormData {
  amount: number;
  dueDate: dayjs.Dayjs;
  payerName: string;
  description: string;
 
}

interface MintInvoiceFormProps {
  onSubmit: (data: MintInvoiceFormData) => Promise<void>;
  isSubmitting: boolean;
  isInitializing: boolean;
  isInitialized: boolean;
  error?: string;
  ipfsCid?: string;
  txHash?: string;
  txError?: string;
  nftId?: number | null;
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  resetForm: () => void;
}

export function MintInvoiceForm({
  onSubmit,
  isSubmitting,
  isInitializing,
  isInitialized,
  error,
  ipfsCid,
  txHash,
  txError,
  nftId,
  onFileChange,
  selectedFile,
  resetForm
}: MintInvoiceFormProps) {
  const [form] = Form.useForm();
  
  // Reset form when transaction is successful
  useEffect(() => {
    if (txHash) {
      form.resetFields();
      resetForm(); // Call the parent's reset function
    }
  }, [txHash, form, resetForm]);

  const handleUpload: UploadProps['onChange'] = (info) => {
    console.log('Upload event triggered:', info);
    
    if (info.fileList.length === 0 || info.file.status === 'removed') {
      console.log('File removed');
      onFileChange(null);
      return;
    }
    
    const file = info.file.originFileObj;
    if (file) {
      console.log('File selected:', file.name);
      // Make sure we're passing the file to the parent's onFileChange function
      onFileChange(file);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      console.log('beforeUpload triggered for file:', file.name);
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        console.error('You can only upload image files!');
      }
      // Call onFileChange directly here as well to ensure it gets called
      if (isImage) {
        onFileChange(file);
      }
      return false; // Prevent automatic upload
    },
    accept: 'image/*',
    maxCount: 1,
    onChange: handleUpload,
    fileList: selectedFile ? [{
      uid: '1',
      name: selectedFile.name,
      status: 'done',
      originFileObj: selectedFile,
    }] : []
  };

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
    console.log('Selected file from state:', selectedFile ? selectedFile.name : 'No file selected');
    
    // Additional verification of file selection
    if (!selectedFile) {
      console.error('No file selected during form submission!');
      return;
    }
    
    // We don't pass the file through the form values, we use the selectedFile from state
    await onSubmit({
      amount: values.amount,
      dueDate: values.dueDate,
      payerName: values.payerName,
      description: values.description
    });
  };

  const fileRequired = !selectedFile;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="Mint Invoice NFT" className="shadow-lg">
        {error && (
          <Alert type="error" message={error} className="mb-4" />
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={isSubmitting || isInitializing || !isInitialized}
        >
          <Form.Item
            label="Invoice Amount"
            name="amount"
            required
            rules={[{ required: true, message: 'Please input the invoice amount!' }]}
          >
            <Input
              type="number"
              placeholder="0.00"
              prefix="$"
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Due Date"
            name="dueDate"
            required
            rules={[{ required: true, message: 'Please select the due date!' }]}
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            label="Payer Name"
            name="payerName"
            required
            rules={[{ required: true, message: 'Please input the payer name!' }]}
          >
            <Input placeholder="Enter payer's name" />
          </Form.Item>

          <Form.Item
            label="Description"
            required
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter invoice description" />
          </Form.Item>

          <Form.Item
            label="Invoice Image"
            name="file"
            required
            rules={[{ required: fileRequired, message: 'Please upload an image!' }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            help={selectedFile ? `Selected file: ${selectedFile.name}` : 'No file selected'}
          >
            <Upload 
              {...uploadProps}
              listType="picture-card"
              onRemove={() => {
                console.log('onRemove triggered');
                onFileChange(null);
                return true;
              }}
            >
              {!selectedFile && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Select Image</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Debug info to show if file is selected */}
          {selectedFile && (
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
              <p>File selected: {selectedFile.name}</p>
              <p>File size: {Math.round(selectedFile.size / 1024)} KB</p>
              <p>File type: {selectedFile.type}</p>
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isInitializing || !isInitialized || !selectedFile }
            block
          >
            {isSubmitting ? 'Minting...' : isInitializing ? 'Initializing...' : 'Mint NFT'}
          </Button>
        </Form>

        {txError && (
          <Alert type="error" message={txError} className="mt-4" />
        )}
        
        {txHash && (
          <Alert
            type="success"
            message={
              <div>
                <p>Transaction successful!</p>
                <p className="text-xs mt-1 break-all">
                  Transaction Hash: {txHash}
                </p>
                {nftId && (
                  <p className="text-sm mt-2">
                    <strong>Invoice NFT ID:</strong> {nftId}
                  </p>
                )}
                {ipfsCid && (
                  <p className="text-xs mt-2 break-all">
                    <strong>IPFS CID:</strong> {ipfsCid}
                  </p>
                )}
              </div>
            }
            className="mt-4"
          />
        )}

        <div className="mt-6 bg-blue-50 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InfoCircleOutlined className="text-blue-400 text-xl" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">What is IPFS?</h3>
              <p className="mt-2 text-sm text-blue-700">
                IPFS (InterPlanetary File System) is a decentralized storage system that will store your invoice image and metadata securely on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}