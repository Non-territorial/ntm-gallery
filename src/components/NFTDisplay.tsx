import React from 'react'
import { getPinataUrl } from '../utility/ipfs'

interface NFTDisplayProps {
  cid: string
  mimeType: string
}

export function NFTDisplay({ cid, mimeType }: NFTDisplayProps) {
  const pinataUrl = getPinataUrl(cid)

  if (mimeType.startsWith('image/')) {
    return <img src={pinataUrl} alt="NFT Content" className="max-w-full h-auto" />
  } else if (mimeType.startsWith('video/')) {
    return (
      <video controls className="max-w-full h-auto">
        <source src={pinataUrl} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    )
  } else {
    return <p>Unsupported media type</p>
  }
}



