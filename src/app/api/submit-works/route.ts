import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pinataSDK from '@pinata/sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Process form data
    const name = formData.get('name')
    const email = formData.get('email')
    const tonWallet = formData.get('ton-wallet')
    
    // Handle file uploads
    const files = []
    for (let i = 1; i <= 100; i++) {
      const file = formData.get(`work-${i}`)
      if (file) {
        files.push(file)
      }
    }

    // Initialize Pinata client (using environment variables)
    const pinata = new pinataSDK({
      pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
      pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
    })

    // Upload files to Pinata
    const uploadPromises = files.map(async (file: any) => {
      const fileData = await file.arrayBuffer()
      const buffer = Buffer.from(fileData)
      
      const result = await pinata.pinFileToIPFS(buffer, {
        pinataMetadata: {
          name: file.name
        }
      })
      
      return {
        originalName: file.name,
        ipfsHash: result.IpfsHash
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      message: 'Works submitted successfully',
      files: uploadedFiles,
      name,
      email,
      tonWallet
    })
  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing submission',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

