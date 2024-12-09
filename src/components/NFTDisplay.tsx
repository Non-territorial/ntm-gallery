'use client'

import React from 'react'
import { getPinataUrl } from '@/utility/ipfs'
import { ShoppingCart } from 'lucide-react'

interface NFTDisplayProps {
  cid: string
  mimeType: string
  price?: string
  onPurchase?: () => void
}

export function NFTDisplay({ cid, mimeType, price = "0.1 TON", onPurchase }: NFTDisplayProps) {
  const pinataUrl = getPinataUrl(cid)

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase()
    }
  }

  const renderContent = () => {
    if (mimeType.startsWith('image/')) {
      return (
        <div className="relative flex items-start gap-4 max-w-full">
          <img 
            src={pinataUrl} 
            alt="NFT Content" 
            className="max-w-[80%] h-auto"
            loading="lazy"
          />
          <div className="flex flex-col gap-2">
            <button 
              onClick={handlePurchase}
              className="bg-[#3b3b4f] hover:bg-[#2d2d3d] text-white border border-white px-4 py-2 rounded-md flex items-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy for {price}
            </button>
          </div>
        </div>
      )
    } else if (mimeType.startsWith('video/')) {
      return (
        <div className="relative flex items-start gap-4 max-w-full">
          <video controls className="max-w-[80%] h-auto">
            <source src={pinataUrl} type={mimeType} />
            Your browser does not support the video tag.
          </video>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handlePurchase}
              className="bg-[#3b3b4f] hover:bg-[#2d2d3d] text-white border border-white px-4 py-2 rounded-md flex items-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy for {price}
            </button>
          </div>
        </div>
      )
    } else if (mimeType.startsWith('audio/')) {
      return (
        <div className="relative flex items-start gap-4 max-w-full">
          <audio controls className="w-full max-w-md my-2">
            <source src={pinataUrl} type={mimeType} />
            Your browser does not support the audio tag.
          </audio>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handlePurchase}
              className="bg-[#3b3b4f] hover:bg-[#2d2d3d] text-white border border-white px-4 py-2 rounded-md flex items-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy for {price}
            </button>
          </div>
        </div>
      )
    } else if (mimeType === 'application/pdf') {
      return (
        <div className="relative flex items-start gap-4 max-w-full">
          <div className="w-full aspect-[16/9] relative max-w-[80%]">
            <iframe
              src={pinataUrl}
              className="absolute inset-0 w-full h-full"
              title="PDF document"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handlePurchase}
              className="bg-[#3b3b4f] hover:bg-[#2d2d3d] text-white border border-white px-4 py-2 rounded-md flex items-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy for {price}
            </button>
          </div>
        </div>
      )
    } else {
      return <p className="text-red-500">Unsupported media type</p>
    }
  }

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  )
}

