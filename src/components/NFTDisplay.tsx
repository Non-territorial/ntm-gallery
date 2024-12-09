'use client';

import React from 'react';
import { getPinataUrl } from '../utility/ipfs';

interface NFTDisplayProps {
  cid: string
  mimeType: string
}

export function NFTDisplay({ cid, mimeType }: NFTDisplayProps) {
  const pinataUrl = getPinataUrl(cid);

  if (mimeType.startsWith('image/')) {
    return (
      <img 
        src={pinataUrl} 
        alt="NFT Content" 
        className="max-w-full h-auto"
        loading="lazy"
      />
    );
  } else if (mimeType.startsWith('video/')) {
    return (
      <video controls className="max-w-full h-auto">
        <source src={pinataUrl} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    );
  } else if (mimeType.startsWith('audio/')) {
    return (
      <audio controls className="w-full max-w-md my-2">
        <source src={pinataUrl} type={mimeType} />
        Your browser does not support the audio tag.
      </audio>
    );
  } else if (mimeType === 'application/pdf') {
    return (
      <div className="w-full aspect-[16/9] relative">
        <iframe
          src={pinataUrl}
          className="absolute inset-0 w-full h-full"
          title="PDF document"
        />
      </div>
    );
  } else {
    return <p className="text-red-500">Unsupported media type</p>;
  }
}




