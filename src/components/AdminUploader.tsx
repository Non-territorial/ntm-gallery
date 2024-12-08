'use client'

import React, { useState } from 'react'
import { uploadToPinata } from '../utility/ipfs'
import { Button } from '@/components/ui/button'

export default function AdminUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [ipfsHash, setIpfsHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      const hash = await uploadToPinata(file);
      setIpfsHash(hash);
    } catch (error) {
      console.error('Upload failed:', error);
      setIpfsHash(null);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full text-white bg-transparent border border-[#616770] p-2 rounded-md"
        disabled={uploading}
      />
      
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-[#3b3b4f] text-white border border-white hover:bg-[#4a4a5f]"
      >
        {uploading ? 'Uploading...' : 'Upload to Pinata'}
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-500 text-white rounded-md">
          Error: {error}
        </div>
      )}

      {ipfsHash && (
        <div className="mt-4 p-4 bg-[#3b3b4f] rounded-md">
          <p>Upload successful!</p>
          <p className="break-all">IPFS Hash: {ipfsHash}</p>
        </div>
      )}
    </div>
  )
}

