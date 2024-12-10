'use client';

import React from 'react';
import { AdminUploader } from '@/components/AdminUploader';

export default function AdminUploadPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <p>This page is for authorized personnel only. All uploads will be stored on IPFS via Pinata.</p>
      </div>

      <div className="border border-gray-200 rounded-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Upload New NFT</h2>
        <p className="mb-4">Upload an image or video file to create a new NFT</p>
        <AdminUploader />
      </div>

      <div className="border border-gray-200 rounded-md p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Uploads</h2>
        <p className="mb-4">View and manage your recent IPFS uploads</p>
        <p>Recent uploads will be displayed here.</p>
      </div>
    </div>
  );
}
